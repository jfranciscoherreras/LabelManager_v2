import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from '@mui/material';
import InfoIcon from  '@mui/icons-material/Info';

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [loadingButton, setLoadingButton] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/customers');
        setCustomers(response.data);
        setFilteredRows(response.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  }, [searchTerm, customers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleIngresarClick = (customerId, sqlserverid, database, customerName) => {
    setDialogMessage(`Cliente: ${customerName}, ID: ${customerId}, Base de Datos: ${database}, SQL Server ID: ${sqlserverid}`);
    setOpenDialog(true);
  };

  const handleContinueClick = async () => {
    setOpenDialog(false);
    const customerId = dialogMessage.split(', ')[1].split(': ')[1];
    setLoadingButton(customerId);
    try {
      await axios.post(`/select_customer/${customerId}`);
      navigate('/customer-details');
    } catch (err) {
      console.error('Error selecting customer:', err);
    } finally {
      setLoadingButton(null);
    }
  };

  return (
<div style={{ maxWidth: "100%" }}>      
<Box display="flex" mb={4}>
        <TextField 
          label="Buscar" 
          variant="outlined" 
          sx={{ width: '50%' }} 
          size='small'
          margin="normal" 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID del Cliente</TableCell>
              <TableCell>Nombre del Cliente</TableCell>
              <TableCell>Base de Datos</TableCell>
              <TableCell>ID del Servidor SQL</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.CustomerSetupId}>
                <TableCell>{row.CustomerSetupId}</TableCell>
                <TableCell>{row.CustomerName}</TableCell>
                <TableCell>{row.database}</TableCell>
                <TableCell>{row.sqlserverid}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    size="small" 
                    color="success"
                    sx={{ backgroundColor: '#0686b5', '&:hover': { backgroundColor: '#055f80' } }}
                    onClick={() => handleIngresarClick(row.CustomerSetupId, row.sqlserverid, row.database, row.CustomerName)}
                    disabled={loadingButton === row.CustomerSetupId}
                  >
                    {loadingButton === row.CustomerSetupId ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <InfoIcon style={{ verticalAlign: 'middle', marginRight: '5px', color:'#ffc107' }} />
          Confirmación de Acceso
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Ingresarás a una instancia en producción, ¿Estás seguro de continuar?
          </Typography>
          <DialogContentText style={{ fontWeight: 'bold' }}>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button onClick={handleContinueClick} color="primary" variant="contained" size="small" sx={{ backgroundColor: '#0686b5', '&:hover': { backgroundColor: '#055f80' } }}>
            Continuar
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="contained" size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
