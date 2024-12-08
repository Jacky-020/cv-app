import React, {useState, useEffect} from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { StyledButton, StyledCard, StyledContainer } from './RegistrationStyle';
import { connectEthereum } from '../utils/utils';

/**
 * ShowReceivedRecords Component
 *
 * This component displays a list of work experience records that have been 
 * received by the logged-in user, allowing employers to review and approve 
 * these records.
 *
 * Functionalities:
 * - Checks the user's role (employer or employee) upon mounting.
 * - Retrieves records based on the user's role:
 *   - Employers can view received work records.
 *   - Employees can view submitted work records (submitted in 'propose work experience').
 * - Allows employers to approve selected records using checkboxes.
 * - Displays relevant information for each record, including employer and 
 *   employee names, confirmation status, and additional details in a tooltip.
 *
 * State Management:
 * - Uses local state to manage the list of records, checked items for approval, 
 *   the user's role, and any alert messages.
 *
 * User Interaction:
 * - Hover over comment icon to view detail description
 * - Users can toggle checkboxes to select records for approval.
 * - Provides visual feedback on the confirmation status of each record.
 * - Alerts the user in case of network errors or if MetaMask is not installed.
 *
 * The component is styled using Material-UI for a modern and responsive design.
 */

const ShowRecords = () => {
  // State variables to manage checked items, records, user role, and alert messages
  const [checked, setChecked] = useState([]); // Tracks which records are selected for approval
  const [records, setRecords] = useState([]); // Stores the retrieved records
  const [isEmployer, setIsEmployer] = useState(null); // Indicates if the user is an employer
  const [alertMessage, setAlertMessage] = useState(''); // Message for alerts

  // Toggles the checked state of a record when clicked
  const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      // Add or remove the record from the checked list
      if (currentIndex === -1) {
          newChecked.push(value);
      } else {
          newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked); // Update the checked state
  };

  // Checks the user's role (employer or employee) to determine which records to retrieve
  const checkRole = async () => {
      const contract = await connectEthereum();
      
      try {
          const role = await contract.checkRole(); // Call contract to check user role
          if (role === 'employer') {
              setIsEmployer(true); // Set state if user is an employer
          } else if (role === 'employee') {
              setIsEmployer(false); // Set state if user is an employee
          } else {
              setAlertMessage('Register first'); // Alert if user is not registered
          }
      } catch (error) {
          setAlertMessage('Network error'); // Alert on network errors
      }
  };

  // Retrieves records based on the user's role
  const retrieveRecords = async () => {

      const contract = await connectEthereum();
      const myAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
          // Fetch records based on user role
          if (isEmployer) {
              const result = await contract.getEmployerRecords(myAccounts[0]);
              setRecords(result); // Store employer records
          } else {
              const result = await contract.getEmployeeRecords(myAccounts[0]);
              setRecords(result); // Store employee records
          }
      } catch (error) {
          setAlertMessage('No records'); // Alert if no records are found
      }
  };

  // Approves selected records by calling the contract method
  const approveRecords = async () => {
      const contract = await connectEthereum();
      let approvalList = [];
      
      // Gather records that are checked for approval
      for (const index of checked) {
          approvalList.push(records[index]);
          console.log(records[index]);
        }
        
        try{
            // Confirm each selected record
            for (const record of approvalList) {
                await contract.confirmWorkExperience(record.entryId); // Confirm work experience in the contract
            }
        }catch(error){
            alert("rejected"); // alert for rejection
        }
    };
    
    // Effect to check user role on component mount
    useEffect(() => {
        checkRole(); // Call checkRole function to determine user role
    }, []);
  
    // Effect to retrieve records when the user's role is determined
    useEffect(() => {
        if (isEmployer != null) {
            retrieveRecords(); // Fetch records based on user role
        }
    }, [retrieveRecords, isEmployer]);

  return (
    <StyledContainer>
        <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
            <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                Records
            </Typography>
            <h1>{alertMessage}</h1> {/* Display alert messages to the user */}
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {records.map((record, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                        <ListItem key={index} disablePadding>
                            {/* Button to toggle selection of the record */}
                            <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                                {isEmployer === true && !record.confirmed && (
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.includes(index)} // Check if the record is selected
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                )}
                                </ListItemButton>
                                {/* Brief info of the record */}
                                <ListItemText
                                    id={labelId}
                                    secondary={
                                        <>
                                            <div style={{ color: '#003366', fontWeight: 'bold' }}>
                                                Employer - {record.employerName}</div>
                                            <div style={{ color: '#666666', fontSize: '0.6rem' }}>
                                                {record.employer}
                                            </div>
                                            <div style={{ color: '#4A90E2', fontWeight: 'bold' }}>
                                                Employee - {record.employeeName}
                                            </div>
                                            <div style={{ color: '#666666', fontSize: '0.6rem' }}>
                                                {record.employee}
                                            </div>
                                            <div style={{ color: record.confirmed ? '#28a745' : '#dc3545' }}>
                                                Confirmed: {record.confirmed ? 'Yes' : 'No'}
                                            </div> {/* Green for Yes, red for No */}
                                        </>
                                    }
                                />
                            {/* Tooltip to show the detail record description */}
                            <Tooltip title={record.description} arrow>
                                <IconButton edge="end" aria-label="comments">
                                    <CommentIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            {/* Button for approving checked records, available for employer only */}
            </List>
            {isEmployer === true && (
                <StyledButton
                    type="button" 
                    variant="contained"
                    color="primary"
                    onClick={approveRecords}
                >
                    Approve
                </StyledButton>
            )}
        </StyledCard>
    </StyledContainer>
  );
}

export default ShowRecords;