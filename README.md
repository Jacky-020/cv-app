# Getting Started with this App

This README explain the function in this application.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (which includes npm)
- [Visual Studio Code](https://code.visualstudio.com/)
- MetaMask extension on browser

## Steps to Open the App

### Direct access to netlify ###
https://jacky-020-cv-app.netlify.app/

### Deploy locally (may fails because of environmental issue) ###
1. **Download the Project**
   - Download the project folder and extract it to your desired location.

2. **Open the Project in VS Code**
   - Launch Visual Studio Code.
   - Open the downloaded project folder.

3. **Navigate to the Project Directory**
   - In the terminal, change directory to the folder /cv_app:
     ```bash
     cd ./[file_path]/cv_app
     ```

4. **Install Dependencies**
   - Run the following command to install all necessary dependencies:
     ```bash
     npm install
     ```

5. **Start the Application**
   - After the installation is complete, start the application with:
     ```bash
     npm start
     ```
   - This will launch the app in your default web browser.

6. **View the App**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

### Troubleshooting

- If you encounter any issues, ensure that all dependencies are installed correctly and that your Node.js version is compatible with the project.
- `node -v` to check nodejs version, the version I uses is `20.15.1`


# General View

This is a CV validation app that provides additional validation features for job-seeking applications like LinkedIn.

### General Features:

- As an *employee*, you can send work experience proposals to an *employer* and wait for approval.
- As an *employer*, you can approve received proposals.
- Upon approving a proposal, the *employer* gains reputation points as a sign of being more trustworthy.
- As an *employer*, you can comment on other *employers* when necessary (peer comments).
- For all users, you can view *employees'* work experience records. The decentralized and transparent properties of blockchain ensure confidentiality.
- For all users, you can view peer comments about *employers*. This ensures that *employers* are responsible when approving work experience records; otherwise, they may be condemned by other *employers*.

This app must be used with the MetaMask plugin. When using the app, please switch to the corresponding MetaMask account. All actions will be sent using this MetaMask account, and there are no other login functions available.

### Pages:

- **Registration (Starting Page)**: For registering a MetaMask account as one of the two types: *employee* or *employer*.
- **Show Records**: Displays submitted/received work experience records for the current account.
- **Propose Work Experience**: Allows *employee* accounts to send proposed work experience records to *employers*.
- **Search Employers**: Displays a list of employer accounts. Users can click on a particular employer to see their peer comments. If the user is an *employer*, they can proceed to comment if they have enough reputation points.
- **Search Employees**: For checking the work experience records of other *employees*.

# Detail workflow

### preparation

1. login Metamask account
![](markdown_images\login_metamask.png)
2. connect Metamask account to the app
![](markdown_images\connect_metamask.png)
- The app only works when you have switched to a connected Metamask account

### registration

1. click on the **REGISTRATION** on the top navbar to switch to registation page.
2. Enter the account name.
3. To register your account as *employee*, click on the left tab (**REGISTER AS EMPLOYEE**) . To register your account as *employer*, click on the right tab (**REGISTER AS EMPLOYER**).
4. Comfirm transaction with your Metamask account, makes sure you have enough ether.
5. The button will turn grey during the transaction, please wait patiently.
6. Upon successful registration, the button returns normal and an alert `${name} has been registered as ${role} successfully!` pops out.
7. This account can then be used in other function
- Each Metamask account can only register once, either as *employee* or *employer*. This is to encourage user to be responsible to their account.
- For testing, recommends to at least prepare 2 accounts, one as an *employee* and another as *employer*
![](markdown_images\registration.png)

### Propose

**switch to an employee account**

1. Click **SEARCH EMPLOYERS** on the navbar to the employer page.
2. Choose an employer that you want to propose a work experience record for validation, copy the account address (the text with smaller size).
![](markdown_images\choose_employer.png)
3. Click **PROPOSE** on the navbar to the propose page.
4. Paste the copied account address, enter the propose work description and click **SUBMIT PROPOSAL**
![](markdown_images\propose.png)
5. The propose work experience can be viewed in **SHOW RECORDS** page by the sender (*employee*) and receiver (*employer*) as **Comfirmed: No**.
- It takes time for the proposal to settle in the blockchain, you need to wait for a few seconds before it appears in the **SHOW RECORDS** page. An alert will show up when it finished.
- This waiting time is insignificant in real scenerio as you should not expect employer to immediate approve your proposal.
![](markdown_images\successful_propose.png)

### Approve Records

**switch to an employer account**

1. Notes the difference in UI for *employee* and *employer*: *employer* has check box and approve button.
2. Hover over the comment icon to see the work description (available for both *employer* and *employee* account).
3. Click on those records that you want to approve, then click **APPROVE**.
4. Wait for the transaction settles, revisit the **SHOW RECORDS** page, you will see the the record approved will be indicated as **Comfirmed: Yes**.
- approve record from sender's account (*employee*)
![](markdown_images\approve_record.png)
- record after approval from sender's account (*employee*)
![](markdown_images\jacky_record.png)
- record after approval from receiver's account (*employer*)
![](markdown_images\cuhk_record.png)

### Views any employee record

**may switch to any account**

1. Copy the account address of the *employee* you want to view. For convenient, you may copy the address of your *employee* account.
2. Mouse over from the text field, you should see the record list if the address is correct
3. Notes that only the comfirmed records are shown, the *employee* name is also hidden for privacy
- Notes that there is no way to get the list of *employee*, you are supposed to get the *employee* name and address through other routes, e.g. in CV or social media like LinkedIn. This ensures that all visitors have get permission from that *employee* to protect privacy.
![](markdown_images\search_employee.png)

### Employer list

**switch to employer account**

1. Observe the employer list. 
2. The number in the **brown ellipse** is the **reputation points**. It equals to the number of records approved by that *employer*, representing the trustworthiness of that *employer*. It is also the upper limit of peer comment made by that *employee*.
3. The number to the right of the **up arrow** and **down arrow** are the number of **up vote** and **down vote** made by other employers respectively.
1. Click on the **COMMENT** button to make peer comment (in an *employer* account), make sure you have more reputation points than the peer comment you made. If not, approve some.
2. Enter the comment and choose either **upvote** or **downvote**, then click **SEND COMMENT**.
3. Wait and you will see the peer comment appears.
- Initial view from an *employer* account
![](markdown_images\employer_list.png)
- Send peer comment with an *employer* account
![](markdown_images\make_peer_comment.png)
- view from an *employer* account (click on one of the *employers*)
![](markdown_images\employer_view_peer_comment.png)
- view from an *employee* account (click on one of the *employers*)
![](markdown_images\employee_view_peer_comment.png)

# Mechanism

### Registration

#### Frontend

- /src/compomnents/Registration.js

```js
const handleRegistration = async (role) => {
      // Validate name input
      if (!name) {
         setError('Name cannot be empty.');
         return;
      }

      const contract = await connectEthereum();
      
      try {
         setLoading(true);
         // Call the appropriate contract method based on role
         const tx = (role === 'employee') ? await contract.registerEmployee(name) : await contract.registerEmployer(name);
         const result = await tx.wait();

         // Check transaction status
         if (result.status === 1) {
               alert(`${name} has been registered as ${role} successfully!`);
               setName(''); // Clear input field
               setError(''); // Clear any previous errors
         } else {
               setError('Transaction rejected.'); // Handle transaction rejection
         }
      } catch (e) {
         console.error(e);
         setError(`Error registering as ${role}. Please try again.`); // Handle any errors
      } finally {
         setLoading(false); // Reset loading state
      }
   };
```
- When click on the registration button, `handleRegistration` is called, which then call either the `registerEmployee` or `registerEmployer` in solidity corresponding to the button clicked.

#### Backend
```js 
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

    mapping(address => Employee) internal employees; // stores all employees
    mapping(address => Employer) internal employers; // stores all employers
    mapping(uint256 => WorkExperienceEntry) internal universalExperienceRecord; // stores all work experience records
    mapping(uint256 => PeerComment) internal peerCommentRecord; // stores all peerComment
    address[] internal employerAddresses; // store employer address
    uint256 internal nextEntryId; // Track the next work experience record entry ID
    uint256 internal nextPeerCommentId; // Track next PeerComment ID

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
``` 
-  `Employee`:
   -   `uint256[] submittedExperienceIds`: corresponds to the work experience records submitted
-   `Employer`: 
    -   `uint256 [] receivedExperienceIds`: corresponds to the work experience records received
    -   `uint256[] peerCommentIds`: corresponds to peer comment received
- The above keep an array of id, which are the references to the actual storage of experience record entries and peer comment in `mapping universalExperienceRecord` and `mapping peerCommentRecord`
- Both `registerEmployee` and `registerEmployer` new an `Employee` or `Employer` with the `name` and `addr` set and all other fields empty. 
- `registerEmployer` also stores the address in `address[] employerAddresses` for the retrieval of employer list.

### Propose

#### Frontend

- /src/compomnents/Propose.js

```js
    // State variables for employer address and work description
    const [employerAddress, setEmployerAddress] = useState('');
    const [workDescription, setWorkDescription] = useState('');

    // Handles form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Connect to Ethereum and get the contract
        const contract = await connectEthereum();

        try {
            // Call the contract method to propose work experience
            const tx = await contract.proposeExperience(employerAddress, workDescription);
            await tx.wait(); // Wait for the transaction to be mined
            alert('Proposal has been sent!'); // Notify the user of success
        } catch (error) {
            console.error(error); // Log the error for debugging
            alert('Error in sending proposal. Please try again. Make sure you are logged in using your employee metamask account.'); // Notify the user of the error
        }
    };
```

- get the `employerAddress` and `workDescription` from text field
- When click on the submit button, `handleSubmit` is called, which then call `proposeExperience` in solidity corresponding to the button clicked.

#### Backend

```js
    struct WorkExperienceEntry {
        string description; // work description
        address employer; // receiver's address
        string employerName;
        address employee; // sender's address
        string employeeName;
        uint256 entryId; // ref to universalExperienceRecord
        bool confirmed;
    }
   mapping(uint256 => WorkExperienceEntry) internal universalExperienceRecord; // stores all work experience records

   uint256 internal nextEntryId; // Track the next work experience record entry ID

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
```

- `WorkExperienceEntry`:
  - `description`: main body of the work description
  - `employer`, `employerName`, `employee`, `employeeName`: info of sender and receiver
  - `entryId`: key id in the `mapping universalExperienceRecord` where this entry is stored
  - `comfirmed`: signify if the record is comfirmed, it is set to be false in this `proposeExperience` function
- `proposeExperience`:
  - Check if the sender and receiver are valid
  - new a `WorkExperienceEntry` with `comfirmed` set to `false`, then stored in `mapping universalExperienceRecord`
  - store the entry id `nextEntryId` in `submittedExperienceIds` of the sender (*employee*) and `receivedExperienceIds` of the receiver (*employer*). This allows the sender and receiver to retrieve the entry.
  - increment the `nextEntryId` to prepare for the next entry.

### Show Records

```js
/**
 * Registration Component
 *
 * This component provides a user interface for registering users as either 
 * an employee or an employer within the application. It includes an input 
 * field for entering the user's name. There are 2 buttons for registering as 
 * employee and employer respectively.
 *
 */

const Registration = () => {
    // State variables for name input, loading status, and error messages
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handles registration for employee or employer based on the button clicked
    const handleRegistration = async (role) => {
        // Validate name input
        if (!name) {
            setError('Name cannot be empty.');
            return;
        }

        const contract = await connectEthereum();
        
        try {
            setLoading(true);
            // Call the appropriate contract method based on role
            const tx = (role === 'employee') ? await contract.registerEmployee(name) : await contract.registerEmployer(name);
            const result = await tx.wait();

            // Check transaction status
            if (result.status === 1) {
                alert(`${name} has been registered as ${role} successfully!`);
                setName(''); // Clear input field
                setError(''); // Clear any previous errors
            } else {
                setError('Transaction rejected.'); // Handle transaction rejection
            }
        } catch (e) {
            console.error(e);
            setError(`Error registering as ${role}. Please try again.`); // Handle any errors
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <StyledContainer maxWidth="sm">
            <StyledCard elevation={16}>
                <FormContainer>
                    <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                        Register 
                    </Typography>
                    <form>
                        {/* Text field for entering the account name */}
                        <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            id="name"
                            label="Enter your name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {error && <p style={{ color: 'red' }} aria-live="assertive">{error}</p>}
                        <div>
                            {/* Button for registering as an employee */}
                            <StyledButton
                                type="button" 
                                variant="contained"
                                color="primary"
                                onClick={() => handleRegistration('employee')}
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register as Employee'}
                            </StyledButton>
                            {/* Button for registering as an employer */}
                            <StyledButton
                                type="button" 
                                variant="contained"
                                color="primary"
                                onClick={() => handleRegistration('employer')}
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register as Employer'}
                            </StyledButton>
                        </div>
                    </form>
                </FormContainer>
            </StyledCard>
        </StyledContainer>
    );
}
```