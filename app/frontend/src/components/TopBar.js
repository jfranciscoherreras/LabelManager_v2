import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import zyghthd from '../zyghthd.png';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implementar la lógica de logout
    fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        navigate('/');
      }
    });
  };

  return (
    <AppBar position="static" sx={{ width: '100%', backgroundColor: '#eeeeee' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={zyghthd} alt="Logo" style={{ height: 40, marginRight: 16 }} />
        </Box>
        {user && (
          <Typography variant="body2" sx={{ color: '#000000', marginRight: 2 }}>
            {user}
          </Typography>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          size="small" 
          onClick={handleLogout}
          sx={{ backgroundColor: '#0686b5', '&:hover': { backgroundColor: '#055f80' } }}
        >
          Salir
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
