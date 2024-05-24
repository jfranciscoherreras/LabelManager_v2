import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import Dashboard from '../components/Dashboard';



const Home = () => {
  const [open, setOpen] = useState(true); 

  const handleClose = () => {
    setOpen(false); 
  };

  return (
    <Box mb={4}>
      {open && ( 
        <Alert severity="info" onClose={handleClose} sx={{margin:5}}>
          Instrucciones sobre cambios de Etiquetas
        </Alert>

      )}
      <div style={{ display: 'flex', flexDirection: 'column', margin:40}}>
        <Dashboard />
      
      </div>


    </Box>
    
  );
};

export default Home;
