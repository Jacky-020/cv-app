import React, { useEffect, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
    Icon,
    TextField,
    Radio,
    FormControlLabel,
    FormControl,
    RadioGroup
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { StyledContainer, StyledCard, StyledButton } from './RegistrationStyle';
import { connectEthereum } from '../utils/utils';

/**
 * EmployerPage Component
 *
 * This component serves as a user interface for interacting with a list of employers 
 * on a blockchain platform. It allows users to view employer details, including peer 
 * comments and voting options (upVote or downVote). The component is designed to handle 
 * both employer and employee roles, enabling employers to leave comments and vote on 
 * other employers.
 *
 * Main Features:
 * - Displays a list of employers retrieved from the blockchain.
 * - Users can select an employer to view detailed information, including their reputation 
 *   points, upVote/downVote counts, and peer comments.
 * - Provides functionality to leave comments on selected employers, with the option to 
 *   upVote or downVote.
 * - Checks the user's role (employer or employee) to determine available actions.
 *
 * State Management:
 * - Uses React state to manage the employer list, the current mode (selecting or commenting), 
 *   the selected employer, peer comments, the user's vote choice, and the comment text input.
 *
 * User Interaction:
 * - Users can click on an employer to see their details and peer comments.
 * - Employers can leave comments and vote on the employers they select.
 * - Alerts are provided for errors, such as when fetching data or sending comments.
 *
 * The layout is built using Material-UI components for a responsive and modern design,
 * ensuring a seamless user experience across devices.
 */

// Handle randering of employer list
const EmployerList = ({ employerList, onSelect }) => (
    <List>
        {employerList.map((employer, index) => (
            <ListItem button key={index} onClick={() => onSelect(employer)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <ListItemText primary={employer.name} sx={{ color: 'purple' }} />
                        {/* Reputation points display */}
                        <Box
                            bgcolor="primary.main"
                            color="white"
                            px={0.5}
                            borderRadius="50%"
                            fontSize="small"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width={20}
                            height={20}
                            sx={{ margin: '0.3rem', marginRight: 8 }}
                        >
                            {employer.reputationPoints.toString()}
                        </Box>
                        {/* Up vote display */}
                        <Box sx={{ color: 'green', display: 'flex', flexDirection: 'row' }}>
                            <Icon><ArrowUpward /></Icon>
                            <Typography>{employer.upVote.toString()}</Typography>
                        </Box>
                        {/* Down vote display */}
                        <Box sx={{ color: 'red', display: 'flex', flexDirection: 'row' }}>
                            <Icon><ArrowDownward /></Icon>
                            <Typography>{employer.downVote.toString()}</Typography>
                        </Box>
                    </Box>
                    {/* Employer address display */}
                    <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                        {employer.addr}
                    </Typography>
                </Box>
            </ListItem>
        ))}
    </List>
);

const EmployerPage = () => {
    // State variables to manage employer list, mode, selected employer, peer comments, votes, and comments
    const [employerList, setEmployerList] = useState([]); // List of employers
    const [mode, setMode] = useState(null); // Current mode (selecting or commenting)
    const [selectedEmployer, setSelectedEmployer] = useState(null); // Currently selected employer
    const [peerComments, setPeerComments] = useState([]); // Comments from peers
    const [vote, setVote] = useState(null); // Vote state (true for upVote, false for downVote)
    const [commentText, setCommentText] = useState(); // Text for the comment input
    const [isEmployer, setIsEmployer] = useState(null); // Indicates if the user is an employer

    // Modes for the component
    const MODES = {
        SELECTING: 1,
        COMMENTING: 2
    };

    // Load the employer list from the blockchain
    const loadEmployerList = async (page) => {
        try {
            const contract = await connectEthereum();
            const result = await contract.getEmployerList(page);
            setEmployerList(result); // Set the loaded employer list
        } catch (error) {
            console.error("Error loading employer list:", error);
        }
    };

    // Fetch peer comments for a selected employer
    const fetchPeerComments = async (addr) => {
        try {
            const contract = await connectEthereum();
            const result = await contract.getPeerComments(addr);
            setPeerComments(result); // Set the fetched comments for the employer
        } catch (error) {
            alert("Error fetching peer comments");
        }
    };

    // Handle the selection of an employer
    const handleSelectEmployer = (employer) => {
        setMode(MODES.SELECTING); // Switch to selecting mode
        setSelectedEmployer(employer); // Set the selected employer
        fetchPeerComments(employer.addr); // Fetch comments for the selected employer
    };

    // Switch to commenting mode
    const makeComment = () => {
        setMode(MODES.COMMENTING);
    };

    // Handle changes in voting (upVote or downVote)
    const handleVoteChange = (event) => {
        if (event.target.value === 'downVote') {
            setVote(false); // Set vote to downVote
        } else {
            setVote(true); // Set vote to upVote
        }
    };

    // Send the comment to the blockchain
    const sendComment = async () => {
        try {
            const contract = await connectEthereum();
            await contract.peerComment(commentText, vote, selectedEmployer.addr);
            alert('Comment sent'); // Notify user of successful comment
        } catch (error) {
            alert("You have made more comments than your reputation points!");
        }
    };

    // Check if the current user is an employer
    const checkIsEmployer = async () => {
        try {
            const contract = await connectEthereum();
            const role = await contract.checkRole();
            setIsEmployer(role === 'employer'); // Set employer status based on role
        } catch (error) {
            console.error("Error checking role:", error);
            setIsEmployer(false); // Default to not employer on error
        }
    };

    // Load employer list and check user role on component mount
    useEffect(() => {
        loadEmployerList(1);
        checkIsEmployer();
    }, []);

    let content; // Variable to hold the content based on mode

    // Determine content based on the current mode
    if (mode === MODES.SELECTING) {
        content = (
            <>
                <Typography variant="h6" sx={{ color: 'purple' }}>{selectedEmployer?.name}</Typography>
                <Typography variant="subtitle1" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{selectedEmployer?.addr}</Typography>
                <Typography variant="h6" color='primary'>Peer Comments:</Typography>
                {peerComments.length > 0 ? (
                    peerComments.map((comment, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography sx={{ color: 'purple' }}>{index + 1}. {comment.commentorName}</Typography>
                            {comment.upVote ? (
                                <Box sx={{ color: 'green', display: 'flex', flexDirection: 'row' }}>
                                    <Icon><ArrowUpward /></Icon>
                                </Box>
                            ) : (
                                <Box sx={{ color: 'red', display: 'flex', flexDirection: 'row' }}>
                                    <Icon><ArrowDownward /></Icon>
                                </Box>
                            )}
                            <Typography variant="subtitle1" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{comment.commentorAddress}</Typography>
                            <Typography>{comment.comment}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography>No comments available</Typography>
                )}
                {isEmployer && 
                    <StyledButton
                        type="button" 
                        variant="contained"
                        color="primary"
                        onClick={makeComment}
                    >
                        Comment
                    </StyledButton>
                }
            </>
        );
    } else if (mode === MODES.COMMENTING) {
        content = (
            <>
                <Typography variant="h6" sx={{ color: 'purple' }}>Make comment to {selectedEmployer.name}</Typography>
                <Typography variant="subtitle1" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{selectedEmployer?.addr}</Typography>
                <TextField
                    label="Comments"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth 
                    onChange={(e) => setCommentText(e.target.value)} // Update comment text on change
                    sx={{ margin: '16px 0' }}
                />
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="voting"
                        name="voting"
                        value={vote === true ? 'upVote' : 'downVote'} // Set current vote value
                        onChange={handleVoteChange} // Handle vote changes
                    >
                        <FormControlLabel
                            value="upVote"
                            control={<Radio />}
                            label="Up Vote"
                        />
                        <FormControlLabel
                            value="downVote"
                            control={<Radio />}
                            label="Down Vote"
                        />
                    </RadioGroup>
                </FormControl>
                <StyledButton
                    type="button" 
                    variant="contained"
                    color="primary"
                    onClick={sendComment} // Send the comment to the blockchain
                >
                    Send Comment
                </StyledButton>
            </>
        );
    } else {
        content = <Typography variant="h6">Select an employer to see details</Typography>; // Default content
    }

    return (
        <StyledContainer maxWidth="sm">
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                {/* Left Sidebar for displaying the list of employers */}
                <Paper sx={{ width: '250px', padding: 2 }}>
                    <Typography variant="h6" gutterBottom>Employers</Typography>
                    <EmployerList employerList={employerList} onSelect={handleSelectEmployer} /> {/* Render the employer list */}
                </Paper>
            </StyledCard>

            {/* Right Detail Area for displaying selected employer's details */}
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                <Box sx={{ flexGrow: 1, padding: 2 }}>
                    {content} {/* Render the content based on the current mode */}
                </Box>
            </StyledCard>
        </StyledContainer>
    );
};

export default EmployerPage;