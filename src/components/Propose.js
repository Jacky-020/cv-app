import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import {
    StyledContainer,
    StyledCard,
} from "./RegistrationStyle";
import { ethers } from 'ethers';
import WorkExperienceValidation from '../contract/WorkExperienceValidation.json';

import { contractAddress } from '../config';

export default function Propose() {
    const [employerAddress, setEmployerAddress] = useState('');
    const [workDescription, setWorkDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);


        try {
            const tx = await contract.proposeExperience(employerAddress, workDescription);
            await tx.wait();
            alert('Proposal has been sent!');
        } catch (error) {
            console.error(error);
            alert('Error in sending proposal. Please try again.');
        }
    };

    return (
        <StyledContainer maxWidth="sm">
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5}}>
                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit} 
                    
                >
                    <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                        Propose your work experience 
                    </Typography>
                                        <TextField
                        id="outlined-employer-address"
                        label="Employer Address"
                        name="employerAddress"
                        placeholder="Enter the employer account address"
                        multiline
                        rows={1}
                        value={employerAddress} 
                        onChange={(e) => setEmployerAddress(e.target.value)} 
                        fullWidth 
                        InputProps={{
                            sx: {
                                fontSize: '0.6rem', 
                            },
                        }}
                    />
                    <TextField
                        id="outlined-work-description"
                        label="Work Experience Description"
                        name="workDescription"
                        placeholder="Propose a work experience description"
                        multiline
                        rows={5}
                        value={workDescription} 
                        onChange={(e) => setWorkDescription(e.target.value)} 
                        fullWidth
                    />
                    
                    <Box sx={{ m: 1, display: 'flex', justifyContent: 'center'}} >
                        <Button type="submit" variant="contained">
                            Submit Proposal
                        </Button>
                    </Box>
                </Box>
            </StyledCard>
        </StyledContainer>
    );
}