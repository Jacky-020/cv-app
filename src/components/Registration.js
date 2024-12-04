// src/components/EmployeeRegistration.js

import React, { useState } from 'react';
import { ethers } from 'ethers';
import WorkExperienceValidation from '../contract/WorkExperienceValidation.json';
import {
    StyledContainer,
    StyledCard,
    FormContainer,
    StyledForm,
    StyledTextField,
    StyledButton
} from "./RegistrationStyle";
import { Box, Typography } from '@mui/material';
import { contractAddress } from '../config';


function Registration(){
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const registerEmployee = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (!name) {
            alert('Name cannot be empty.');
            return;
        }

        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
        
        
        try {
            setLoading(true);
            const tx = await contract.registerEmployee(name);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                console.log(receipt)
                alert("Registration successful!");
            } else {
                alert("Transaction rejected.");
            }
            setName('');
        } catch (error) {
            console.error(error);
            alert('Error registering employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const registerEmployer = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (!name) {
            alert('Name cannot be empty.');
            return;
        }

        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
        
        
        try {
            setLoading(true);
            const tx = await contract.registerEmployer(name);
            await tx.wait();
            alert('Employer registered successfully!');
            setName('');
        } catch (error) {
            console.error(error);
            alert('Error registering employer. Please try again.');
        } finally {
            setLoading(false);
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
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div>
                            <StyledButton
                                type="button" 
                                variant="contained"
                                color="primary"
                                onClick={registerEmployee}
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register as Employee'}
                            </StyledButton>
                            <StyledButton
                                type="button" 
                                variant="contained"
                                color="primary"
                                onClick={registerEmployer}
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
};




export default Registration;