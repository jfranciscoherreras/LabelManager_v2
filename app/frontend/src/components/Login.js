import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography,Box,Alert  } from '@mui/material';
import zyghthd from '../zyghthd.png';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.message) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <img src={zyghthd} alt="Logo" style={{ marginBottom: '5%', width: '40%', height: '50%' }} />
        <Typography variant="h6" component="h1" gutterBottom>
          Administrador de Etiquetas
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ marginTop: '16px', backgroundColor: '#0686b5', '&:hover': { backgroundColor: '#055f80' } }}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
