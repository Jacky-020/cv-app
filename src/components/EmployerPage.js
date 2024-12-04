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
import { ArrowUpward, ArrowDownward, Block } from '@mui/icons-material';
import { ethers } from 'ethers';
import { contractAddress } from '../config';
import WorkExperienceValidation from '../contract/WorkExperienceValidation.json';
import { StyledContainer, StyledCard, StyledButton } from './RegistrationStyle';

const EmployerList = ({ employerList, onSelect }) => (
    <List>
        {employerList.map((employer, index) => (
            <ListItem button key={index} onClick={() => onSelect(employer)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <ListItemText primary={employer.name} sx={{ color: 'purple' }} />
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
                        <Box sx={{ color: 'green', display: 'flex', flexDirection: 'row' }}>
                            <Icon><ArrowUpward /></Icon>
                            <Typography>{employer.upVote.toString()}</Typography>
                        </Box>
                        <Box sx={{ color: 'red', display: 'flex', flexDirection: 'row' }}>
                            <Icon><ArrowDownward /></Icon>
                            <Typography>{employer.downVote.toString()}</Typography>
                        </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                        {employer.addr}
                    </Typography>
                </Box>
            </ListItem>
        ))}
    </List>
);

const EmployerPage = () => {
    const [employerList, setEmployerList] = useState([]);
    const [mode, setMode] = useState(null);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [peerComments, setPeerComments] = useState([]);
    const [vote, setVote] = useState(null); // true for upVote , false for downVote
    const [commentText, setCommentText] = useState();
    const [isEmployer, setIsEmployer] = React.useState(null);
    
    const MODES = {
        SELECTING: 1,
        COMMENTING: 2
    };

    const loadEmployerList = async (page) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
            const result = await contract.getEmployerList(page);
            setEmployerList(result);
        } catch (error) {
            console.error("Error loading employer list:", error);
        }
    };

    const fetchPeerComments = async (addr) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
            const result = await contract.getPeerComments(addr);
            setPeerComments(result);
        } catch (error) {
            alert("Error fetching peer comments");
        }
    };

    const handleSelectEmployer = (employer) => {
        setMode(MODES.SELECTING);
        setSelectedEmployer(employer);
        fetchPeerComments(employer.addr);
    };

    const makeComment = () => {
        setMode(MODES.COMMENTING);
    };

    const handleVoteChange = (event) => {
        if (event.target.value === 'downVote'){
            setVote(false); 
        }else{
            setVote(true);
        }
        
    };

    const sendComment = async() =>{
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
            await contract.peerComment(commentText, vote, selectedEmployer.addr);
            alert('Comment sent')
        } catch (error) {
            alert("You have make more comment than your reputation points!");
        }
    }

    const checkIsEmployer = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
            const role = await contract.checkRole();
            setIsEmployer(role === 'employer');
        } catch (error) {
            console.error("Error checking role:", error);
            setIsEmployer(false);
        }
    };

    useEffect(() => {
        loadEmployerList(1);
        checkIsEmployer();
    }, []);

    let content;

    if (mode === MODES.SELECTING) {
        content = (
            <>
                <Typography variant="h6" sx={{color: 'purple'}}>{selectedEmployer?.name}</Typography>
                <Typography variant="subtitle1" sx={{fontSize: '0.6rem', color: 'text.secondary'}}>{selectedEmployer?.addr}</Typography>
                <Typography variant="h6" color='primary'>Peer Comments:</Typography>
                {peerComments.length > 0 ? (
                    peerComments.map((comment, index) => (
                        <>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography sx={{color: 'purple'}} key={index}>{index + 1}. {comment.commentorName}</Typography>
                            {comment.upVote?(                        
                            <Box sx={{ color: 'green', display: 'flex', flexDirection: 'row' }}>
                                <Icon><ArrowUpward /></Icon>
                            </Box>)
                            :
                            (<Box sx={{ color: 'red', display: 'flex', flexDirection: 'row' }}>
                                <Icon><ArrowDownward /></Icon>
                            </Box>)
                            }
                        </Box>
                        <Typography variant="subtitle1" sx={{fontSize: '0.6rem', color: 'text.secondary'}}>{comment.commentorAddress}</Typography>
                        <Typography key={index}>{comment.comment}</Typography>
                        </>
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
        content = <>
            <Typography variant="h6" sx={{color: 'purple'}}>Make comment to {selectedEmployer.name}</Typography>
                <Typography variant="subtitle1" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{selectedEmployer?.addr}</Typography>
                <TextField
                label="Comments"
                multiline
                rows={4}
                variant="outlined"
                fullWidth 
                onChange={(e)=>setCommentText(e.target.value)}
                sx={{ margin: '16px 0' }}
            />

                <FormControl component="fieldset">
                <RadioGroup
                    aria-label="voting"
                    name="voting"
                    value="upVote"
                    onChange={handleVoteChange}
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
                    onClick={sendComment}
                >      
                    Send Comment
                </StyledButton>
        </>
    } else {
        content = <Typography variant="h6">Select an employer to see details</Typography>;
    }

    return (
        <StyledContainer maxWidth="sm">
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                {/* Left Sidebar */}
                <Paper sx={{ width: '250px', padding: 2 }}>
                    <Typography variant="h6" gutterBottom>Employers</Typography>
                    <EmployerList employerList={employerList} onSelect={handleSelectEmployer} />
                </Paper>
            </StyledCard>

            {/* Right Detail Area */}
            <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
                <Box sx={{ flexGrow: 1, padding: 2 }}>
                    {content}
                </Box>
            </StyledCard>
        </StyledContainer>
    );
};

export default EmployerPage;

