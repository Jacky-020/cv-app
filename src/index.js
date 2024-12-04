// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import App from './App';


// // Define routes
// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Registration contractAddress="0x2434c554B1ea952acB2949D298819a35d4E04797"/>,
//   },
//   {
//     path: "showRecievedRecords",
//     element: <ShowReceivedRecords/>,
//   }
// ]);


// Create a theme
export const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#795548',
    },
    background: {
      default: '#b0bec5',
    },
  },
});

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </React.StrictMode>
);


