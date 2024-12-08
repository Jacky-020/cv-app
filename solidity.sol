// reference Only
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract WorkExperienceValidation {

    struct Employee {
        address addr;
        string name;
        uint256[] submittedExperienceIds; // ref to universalExperienceRecord
    }

    struct Employer {
        address addr;
        string name;
        uint256[] receivedExperienceIds; // ref to universalExperienceRecord
        uint256 reputationPoints; // Points for confirming work experiences
        uint256[] peerCommentIds; // ref to peerCommentRecord
        uint256 commentMadeCounter; // Number of comments made to other employers
        uint256 upVote; // Count of upvotes received
        uint256 downVote; // Count of downvotes received
    }

    struct WorkExperienceEntry {
        string description; // work description
        address employer; // receiver's address
        string employerName;
        address employee; // sender's address
        string employeeName;
        uint256 entryId; // ref to universalExperienceRecord
        bool confirmed;
    }

    struct PeerComment {
        bool upVote;
        string comment;
        string commentorName;
        address commentorAddress;
    }

    mapping(address => Employee) internal employees; // stores all employees
    mapping(address => Employer) internal employers; // stores all employers
    mapping(uint256 => WorkExperienceEntry) internal universalExperienceRecord; // stores all work experience records
    mapping(uint256 => PeerComment) internal peerCommentRecord; // stores all peerComment
    address[] internal employerAddresses; // store employer address
    uint256 internal nextEntryId; // Track the next work experience record entry ID
    uint256 internal nextPeerCommentId; // Track next PeerComment ID

    event EmployeeRegistered(address indexed employeeAddr, string name);
    event EmployerRegistered(address indexed employerAddr, string name);
    event WorkExperienceAdded(uint256 indexed entryId, address indexed employee, address indexed employer);
    event WorkExperienceConfirmed(uint256 indexed entryId, address indexed employer);
    event PeerCommentAdded(address indexed to, address indexed from, string comment, bool upVote);

    constructor() {
        nextPeerCommentId = 1; // Initialize to 1 to avoid zero ID usage
    }

    // Function to register an employee
    function registerEmployee(string memory name) external {
        require(employees[msg.sender].addr == address(0), "You have already registered as an employee");
        require(bytes(name).length > 0, "Name cannot be empty");

        employees[msg.sender] = Employee({
            addr: msg.sender,
            name: name,
            submittedExperienceIds: new uint256[](0) 
        });
        emit EmployeeRegistered(msg.sender, name);
    }

    // Function to register an employer
    function registerEmployer(string memory name) external {
        require(employers[msg.sender].addr == address(0), "You have already registered as an employer");
        require(bytes(name).length > 0, "Name cannot be empty");

        employers[msg.sender] = Employer({
            addr: msg.sender,
            name: name,
            receivedExperienceIds: new uint256[](0),
            reputationPoints: 0,
            peerCommentIds: new uint256[](0),
            commentMadeCounter: 0,
            upVote: 0,
            downVote: 0
        });
        employerAddresses.push(msg.sender);
        emit EmployerRegistered(msg.sender, name);
    }

    // Function to propose a work experience
    function proposeExperience(address to, string calldata workExperience) external {
        require(employees[msg.sender].addr != address(0), "Only employees can submit work experience records");
        require(employers[to].addr != address(0), "You are not sending the message to a valid employer");

        WorkExperienceEntry memory newEntry = WorkExperienceEntry({
            description: workExperience,
            employer: to, 
            employerName: employers[to].name,
            employee: msg.sender,
            employeeName: employees[msg.sender].name,
            entryId: nextEntryId,
            confirmed: false
        });

        universalExperienceRecord[nextEntryId] = newEntry;

        employees[msg.sender].submittedExperienceIds.push(nextEntryId);
        employers[to].receivedExperienceIds.push(nextEntryId);

        emit WorkExperienceAdded(nextEntryId, msg.sender, to);
        nextEntryId++;
    }

    // Function for the employer to confirm a work experience entry
    function confirmWorkExperience(uint256 entryId) external {
        WorkExperienceEntry storage entry = universalExperienceRecord[entryId];
        require(entry.employer != address(0), "This is not a valid entry");
        require(entry.employer == msg.sender, "Only the employer can confirm this entry");
        require(!entry.confirmed, "Entry already confirmed");

        entry.confirmed = true;
        employers[msg.sender].reputationPoints += 1; // Increase reputation points for confirmation

        emit WorkExperienceConfirmed(entryId, msg.sender);
    }

    // Function to get employee records
    function getEmployeeRecords(address employeeAddr) external view returns (WorkExperienceEntry[] memory) {
        require(employees[employeeAddr].addr != address(0), "This is not a valid employee account");

        uint256[] memory experienceIds = employees[employeeAddr].submittedExperienceIds;
        WorkExperienceEntry[] memory records = new WorkExperienceEntry[](experienceIds.length);

        for (uint256 i = 0; i < experienceIds.length; i++) {
            records[i] = universalExperienceRecord[experienceIds[i]];
        }

        return records;
    }

    // Function to get employer records for their employees' experiences
    function getEmployerRecords(address employerAddr) external view returns (WorkExperienceEntry[] memory) {
        require(employers[employerAddr].addr != address(0), "This is not a valid employer account");

        uint256[] memory recordIds = employers[employerAddr].receivedExperienceIds;
        WorkExperienceEntry[] memory records = new WorkExperienceEntry[](recordIds.length);

        for (uint256 i = 0; i < recordIds.length; i++) {
            records[i] = universalExperienceRecord[recordIds[i]];
        }

        return records; 
    }

    // Function to get a paginated list of employers, page start from 1
    function getEmployerList(uint256 page) external view returns (Employer[] memory) {
        uint256 pageSize = 10; // Define how many employers per page
        uint256 startIndex = (page - 1) * pageSize;
        uint256 endIndex = startIndex + pageSize > employerAddresses.length ? employerAddresses.length : startIndex + pageSize;

        require(startIndex < employerAddresses.length, "Page index out of bounds");

        Employer[] memory employerList = new Employer[](endIndex - startIndex);
        
        for (uint256 i = startIndex; i < endIndex; i++) {
            employerList[i - startIndex] = employers[employerAddresses[i]];
        }

        return employerList;
    }

    // Function that allows an employer to comment on another employer
    function peerComment(string calldata commentText, bool upVote, address to) external {
        require(employers[msg.sender].addr != address(0), "This is not a valid employer account");
        require(employers[msg.sender].commentMadeCounter < employers[msg.sender].reputationPoints, 
                "You have made more comments than your reputation points");
        require(to != msg.sender, "You cannot comment on yourself"); // Prevent self-commenting

        PeerComment memory newComment = PeerComment({
            upVote: upVote,
            comment: commentText,
            commentorName: employers[msg.sender].name,
            commentorAddress: msg.sender
        });

        peerCommentRecord[nextPeerCommentId] = newComment;
        employers[to].peerCommentIds.push(nextPeerCommentId);
        nextPeerCommentId++; // Increment the peerCommentId
        employers[msg.sender].commentMadeCounter += 1; // Increment the comment counter

        if (upVote) {
            employers[to].upVote += 1;
        } else {
            employers[to].downVote += 1;
        }

        emit PeerCommentAdded(to, msg.sender, commentText, upVote);
    }

    // Function to get comments made to an employer
    function getPeerComments(address employerAddr) external view returns (PeerComment[] memory) {
        uint256[] memory commentIds = employers[employerAddr].peerCommentIds;
        PeerComment[] memory comments = new PeerComment[](commentIds.length);

        for (uint256 i = 0; i < commentIds.length; i++) {
            comments[i] = peerCommentRecord[commentIds[i]];
        }

        return comments;
    }

    // Function that return the account type
    function checkRole() external view returns (string memory) {
        if(employers[msg.sender].addr != address(0)){
            return "employer";
        }
        if(employees[msg.sender].addr != address(0)){
            return "employee";
        }
        return "none";
    }
}