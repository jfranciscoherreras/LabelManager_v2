import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Box, Typography, Grid, Paper } from '@mui/material';
import styled from '@mui/material/styles/styled';
import CustomerDetails from '../components/CustomerDetails';


const API_ENDPOINT = 'http://localhost:5000/';


const Manager = () => {
    const [logo, setLogo] = useState('');

   
  
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get('/get_logo');
        setLogo(response.data.logo);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>
    <Grid container spacing={2} sx={{ marginTop: 5 }} alignItems="center" justifyContent="center">
    <Grid item xs={12} sm={5} sx={{ border: 1, borderColor: 'white' }}>
        <Typography variant="h5" align="init">Administrador de Etiquetas</Typography>
    </Grid>
    <Grid item xs={12} sm={5}>
        <Box display="flex" justifyContent="center" sx={{ border: 1, borderColor: 'white' }}>
        {logo && <img src={logo} alt="Logo" style={{ width: '150px', height: '60px' }} />}
        </Box>
    </Grid>
    </Grid>


      <div style={{ marginTop: 2 }}>
        <CustomerDetails />
      </div>
    </div>
  );
};

export default Manager;