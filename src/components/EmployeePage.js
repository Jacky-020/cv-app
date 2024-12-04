import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Tooltip,
    Box,
    Typography,
    TextField
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { StyledCard, StyledContainer } from './RegistrationStyle';
import WorkExperienceValidation from '../contract/WorkExperienceValidation.json';
import { contractAddress } from '../config';

export default function EmployeePage() {
    const [records, setRecords] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [employeeAddress, setEmployeeAddress] = useState('');

    const retrieveRecords = async () => {
        if (typeof window.ethereum === 'undefined') {
            setAlertMessage('Please install MetaMask.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
        
        try {
            const result = await contract.getEmployeeRecords(employeeAddress);
            console.log(result);
            setRecords(result);
            setAlertMessage('');
        } catch (error) {
            console.error(error);
            setRecords([]);
            setAlertMessage('No records found');
        }
    };

    useEffect(() => {
        if (employeeAddress) {
            retrieveRecords();
        }
    }, [employeeAddress]);

    return (
        <StyledContainer>
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                    Search Employee
                </Typography>
                <TextField
                    id="outlined-employee-address"
                    label="Employee Address"
                    placeholder="Enter the employee account address"
                    onBlur={(e) => setEmployeeAddress(e.target.value.trim())} 
                    fullWidth 
                    InputProps={{
                        sx: {
                            fontSize: '0.6rem', 
                        },
                    }}
                />
                <h1>{alertMessage}</h1>
                <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 600, color: 'purple' }}>
                    {records.length > 0 ? `Records` : ''}
                </Typography>
                
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {records.map((record, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemText
                                secondary={
                                    <>
                                        <div style={{ color: '#003366', fontWeight: 'bold' }}>
                                            Employer - {record.employerName}
                                        </div> 
                                        <div style={{ color: '#666666', fontSize: '0.6rem' }}>
                                            {record.employer}
                                        </div> 
                                        <div style={{ color: record.confirmed ? '#28a745' : '#dc3545' }}>
                                            Confirmed: {record.confirmed ? 'Yes' : 'No'}
                                        </div>
                                    </>
                                }
                            />
                            <Tooltip title={record.description} arrow>
                                <IconButton edge="end" aria-label="comments">
                                    <CommentIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
            </StyledCard>
        </StyledContainer>
    );
}