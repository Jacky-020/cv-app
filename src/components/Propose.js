import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { StyledContainer, StyledCard } from "./RegistrationStyle";
import { connectEthereum } from '../utils/utils';

/**
 * Propose Work Experience Page
 *
 * This component renders a form for proposing work experience, allowing users to 
 * enter an employer address and a work description. Upon submission, the proposal 
 * is sent to the specified employer account as an "unconfirmed" 
 * record. Users can later check this proposal on the "Show Records" page, 
 * accessible by both the sender (employee) and the receiver (employer).
 *
 * Important: If the sender's account is not recognized as an employee, the 
 * transaction will fail.
 */

const Propose = () => {
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
            alert('Error in sending proposal. Please try again. Make sure you are logged in using your employee metamask accountAn error occurred while sending the proposal. Please try again and ensure that you are logged in with your employee MetaMask account.'); // Notify the user of the error
        }
    };

    return (
        <StyledContainer maxWidth="sm">
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit} 
                >
                    <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
                        Propose Your Work Experience 
                    </Typography>
                    {/* Text field for entering the employer address */}
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
                    {/* Text field for entering work description */}
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
                    {/* Submit button */}
                    <Box sx={{ m: 1, display: 'flex', justifyContent: 'center' }}>
                        <Button type="submit" variant="contained">
                            Submit Proposal
                        </Button>
                    </Box>
                </Box>
            </StyledCard>
        </StyledContainer>
    );
} 
export default Propose;

