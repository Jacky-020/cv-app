// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ShowRecievedRecords from './components/ShowRecords';
import Registration from './components/Registration';
import Propose from './components/Propose';
import EmployerPage from './components/EmployerPage';
import EmployeePage from './components/EmployeePage';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    CV validation
                </Typography>
                <Button color="inherit" onClick={() => navigate('/')}>
                    Registration
                </Button>
                <Button color="inherit" onClick={() => navigate('/showReceivedRecords')}>
                    show records
                </Button>
                <Button color="inherit" onClick={() => navigate('/propose')}>
                    propose work experience
                </Button>
                <Button color="inherit" onClick={() => navigate('/employerPage')}>
                    Search employers
                </Button>
                <Button color="inherit" onClick={() => navigate('/employeePage')}>
                    Search employees
                </Button>
            </Toolbar>
        </AppBar>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Registration />} />
                <Route path="/showReceivedRecords" element={<ShowRecievedRecords />} />
                <Route path="/propose" element={<Propose />} />
                <Route path="/employerPage" element={<EmployerPage/>} />
                <Route path="/employeePage" element={<EmployeePage/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;