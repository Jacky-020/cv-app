import React, { useState } from 'react';
import {
    StyledContainer,
    StyledCard,
    FormContainer,
    StyledTextField,
    StyledButton
} from "./RegistrationStyle";
import { Typography } from '@mui/material';
import { connectEthereum } from '../utils/utils';

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

        // Check for MetaMask installation
        if (typeof window.ethereum === 'undefined') {
            setError('Please install MetaMask.');
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

export default Registration;