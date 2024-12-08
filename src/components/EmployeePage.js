import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Tooltip,
    Typography,
    TextField
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { StyledCard, StyledContainer } from './RegistrationStyle';
import { connectEthereum } from '../utils/utils';

/**
 * EmployeePage Component
 *
 * This component provides a user interface for employees to search for and view 
 * their work experience records stored on a blockchain. Users can input their 
 * Ethereum address to retrieve associated records, including details about 
 * their employers and confirmation status.
 *
 * Main Features:
 * - Allows users to enter their Ethereum account address to fetch their work 
 *   experience records.
 * - Displays a list of records with relevant details, including employer names,
 *   addresses, and confirmation status.
 * - Utilizes Material-UI components for a modern and responsive design.
 * - Provides user feedback through alerts, such as when no records are found 
 *   or when MetaMask is not installed.
 *
 * State Management:
 * - Uses React state to manage the list of records, alert messages, and the 
 *   employee's address input.
 *
 * User Interaction:
 * - Users can input their Ethereum address in a text field, triggering a 
 *   retrieval of records upon blur (losing focus).
 * - Each record is displayed in a list format, with tooltips providing 
 *   additional information about each record.
 *
 */
const EmployeePage = () => {
    // State variables to manage records, alert messages, and employee address input
    const [records, setRecords] = useState([]); // Stores the fetched work experience records
    const [alertMessage, setAlertMessage] = useState(''); // Stores alert messages for user feedback
    const [employeeAddress, setEmployeeAddress] = useState(''); // Stores the employee's Ethereum address

    // Function to retrieve records from the blockchain based on the employee's address
    const retrieveRecords = async () => {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            setAlertMessage('Please install MetaMask.'); // Alert if MetaMask is missing
            return;
        }

        // Connect to the Ethereum contract
        const contract = await connectEthereum();
        
        try {
            // Fetch employee records using the provided address
            const result = await contract.getEmployeeRecords(employeeAddress);
            console.log(result); // Log the retrieved records for debugging
            setRecords(result); // Update the state with the fetched records
            setAlertMessage(''); // Clear any previous alert messages
        } catch (error) {
            console.error(error); // Log error for debugging
            setRecords([]); // Reset records in case of error
            setAlertMessage('No records found'); // Alert if no records are found
        }
    };

    // Effect to retrieve records whenever the employee address changes
    useEffect(() => {
        if (employeeAddress) {
            retrieveRecords(); // Call retrieveRecords if an address is set
        }
    }, [employeeAddress]);

    return (
        <StyledContainer>
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                    Search Employee
                </Typography>
                {/* Input field for employee's Ethereum address */}
                <TextField
                    id="outlined-employee-address"
                    label="Employee Address"
                    placeholder="Enter the employee account address"
                    onBlur={(e) => setEmployeeAddress(e.target.value.trim())} // Update state on blur
                    fullWidth 
                    InputProps={{
                        sx: {
                            fontSize: '0.6rem', // Set font size for input
                        },
                    }}
                />
                <h1>{alertMessage}</h1> {/* Display alert messages */}
                <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 600, color: 'purple' }}>
                    {records.length > 0 ? `Records` : ''} {/* Show "Records" header if any records are found */}
                </Typography>
                
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {/* Map through the records and display them in a list */}
                    {records.map((record, index) => (
                        record.confirmed && (
                        <ListItem key={index} disablePadding>
                            <ListItemText
                                secondary={
                                        <>  
                                            <div style={{ color: '#003366', fontWeight: 'bold' }}>
                                                Employer - {record.employerName} {/* Display employer name */}
                                            </div> 
                                            <div style={{ color: '#666666', fontSize: '0.6rem' }}>
                                                {record.employer} {/* Display employer address */}
                                            </div> 
                                            <div style={{ color: record.confirmed ? '#28a745' : '#dc3545' }}>
                                                Confirmed: {record.confirmed ? 'Yes' : 'No'} {/* Display confirmation status */}
                                            </div>
                                        </>
                                }
                                />
                            {/* Tooltip for showing additional description of the record */}
                            <Tooltip title={record.description} arrow>
                                <IconButton edge="end" aria-label="comments">
                                    <CommentIcon /> {/* Comment icon for additional details */}
                                </IconButton>
                            </Tooltip>
                            
                        </ListItem>
                    )))}
                </List>
            </StyledCard>
        </StyledContainer>
    );
}


export default EmployeePage;