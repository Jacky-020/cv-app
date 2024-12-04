// External Libraries
import * as React from 'react';
import { ethers } from 'ethers';

// Material-UI Components
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    IconButton,
    Tooltip,
    Box,
    Typography
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

// Custom Components and Styles
import { StyledButton, StyledCard, StyledContainer } from './RegistrationStyle';
import WorkExperienceValidation from '../contract/WorkExperienceValidation.json';
import { contractAddress } from '../config';


export default function ShowRecievedRecords() {
  const [checked, setChecked] = React.useState([0]);
  const [records, setRecords] = React.useState([]);
  const [isEmployer, setIsEmployer] = React.useState(null);
  const [alertMessage, setAlertMessage] = React.useState('');
  // const [recordsWithId, setRecordsWithId] = React.useState([]);
    
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

            setChecked(newChecked);
    };
    const checkRole=  async (account) => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
      
      try {
          const role = await contract.checkRole();
          if(role === 'employer'){
            setIsEmployer(true);
          }else if(role === 'employee'){
            setIsEmployer(false);
          }else{
            setAlertMessage('Register first')
          }
      } catch (error) {
          console.error(error);
          setAlertMessage('Network error');
      } 
  }
    const retreiveRecords = async () =>{
        if (typeof window.ethereum === 'undefined') {
          setAlertMessage('Please install MetaMask.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
        const myAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        try {
          
          if(isEmployer){
            const result = await contract.getEmployerRecords(myAccounts[0]);
            setRecords(result);
          }else{
            const result = await contract.getEmployeeRecords(myAccounts[0]);
            setRecords(result);
          }
        } catch (error) {
            console.error(error);
            setAlertMessage('No records');
        } 
    }
    React.useEffect(() => {
      checkRole(); // Call checkAccount on mount
  }, []);
    React.useEffect(() => {
      if(isEmployer != null)
        retreiveRecords();  
  }, [isEmployer]);

    const approveRecords = async ()=>{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
      let approvalList = [];
      for(const index of checked){
        approvalList.push(records[index]);
      }
      for(const record of approvalList){
        contract.confirmWorkExperience(record.entryId);
      }
    }

  return (
  
  <StyledContainer>
      <StyledCard elevation={16} sx={{ width: '400px', margin: 'auto', padding: 5 }}>
        <Typography component="h1" variant="h5" align="center" color='primary' sx={{ fontWeight: 600 }}>
          Records
        </Typography>
        <h1>{alertMessage}</h1>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {records.map((record, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <ListItem key={index} disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                  {isEmployer === true && record.checked && (
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(index)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  )}
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
                </ListItemButton>
                <Tooltip title={record.description} arrow>
                  <IconButton edge="end" aria-label="comments">
                    <CommentIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            );
          })}
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

