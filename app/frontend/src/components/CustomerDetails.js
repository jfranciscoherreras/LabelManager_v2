import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Typography, IconButton, Checkbox, Switch, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { esES } from '@mui/x-data-grid/locales';
import axios from 'axios';
import FormularioBusqueda from './FormularioBusqueda';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  esES
);

const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-root .MuiDataGrid-columnHeader, & .MuiDataGrid-root .MuiDataGrid-cell': {
    fontSize: '0.875rem',
  },
  '& .MuiDataGrid-root .MuiDataGrid-columnHeader': {
    fontWeight: 'bold',
    backgroundColor: '#4fc3f7',
  },
}));

const CustomerDetails = () => {
  const [searchTermLabel, setSearchTermLabel] = useState('');
  const [searchTermModule, setSearchTermModule] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [LanguageId, setLanguageId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [shouldSearchAgain, setShouldSearchAgain] = useState(false);
  const [isMassModification, setIsMassModification] = useState(false);
  const [showMassActionButton, setShowMassActionButton] = useState(false);
  const [openModalbulk, setOpenModalbulk] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [old_word, setOld_word] = useState('');
  const [new_word, setNew_word] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [FilterLanguage, setFilterLanguage] = useState('');
  // const [logo, setLogo] = useState('');


  const handleChange = (event) => {
    setFilterLanguage(event.target.value);
  };

  const currencies = [
    {
      value: 1,
      label: 'Español',
    },
    {
      value: 2,
      label: 'Inglés',
    },
    {
      value: 3,
      label: 'Portugués',
    },
    {
      value: 4,
      label: 'Todos',
    },
  ];

  // useEffect(() => {
  //   const fetchLogo = async () => {
  //     try {
  //       const response = await axios.get('/get_logo');
  //       setLogo(response.data.logo);
  //     } catch (error) {
  //       console.error('Error fetching logo:', error);
  //     }
  //   };

  //   fetchLogo();
  // }, []);

  useEffect(() => {
    if (openModal) {
      setNewLabel('');
    }
  }, [openModal]);

  const handleChangeLabel = (event) => {
    setSearchTermLabel(event.target.value);
  };

  const handleChangeModule = (event) => {
    setSearchTermModule(event.target.value);
  };

  const handleSearchLabel = () => {
    axios.get(`http://127.0.0.1:5000/buscar?searchTerm=${searchTermLabel}`)
      .then(response => {
        console.log('Datos de búsqueda:', response.data);
        setSearchResults(response.data.map(item => ({
          ...item,
          id: item.id,
          action: isMassModification ? <Checkbox color="primary" /> : <IconButton variant="contained" label="Editar" color="primary" size="small" onClick={() => handleModify(item.Label, item.LabelKey)}>
            <EditIcon />
          </IconButton>
        })));
      })
      .catch(error => {
        console.error('Error al buscar:', error);
      });
  };

  const handleSearchModule = () => {
    axios.get(`http://127.0.0.1:5000/buscar?module=${searchTermModule}`)
      .then(response => {
        setSearchResults(response.data.map(item => ({
          ...item,
          id: item.id,
          action: isMassModification ? <Checkbox color="primary" /> : <IconButton variant="contained" label="Editar" color="primary" size="small" onClick={() => handleModify(item.Label, item.LabelKey)}>
            <EditIcon />
          </IconButton>
        })));
      })
      .catch(error => {
        console.error('Error al buscar:', error);
      });
  };

  const handleModify = (label, labelKey, LanguageId) => {
    setCurrentLabel(label);
    setLabelKey(labelKey);
    setLanguageId(LanguageId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewLabel('');
    if (shouldSearchAgain) {
      handleSearchLabel();
      setShouldSearchAgain(false);
    }
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedIds(prevIds => [...prevIds, id]);
    } else {
      setSelectedIds(prevIds => prevIds.filter(item => item !== id));
    }
  };

  const handleMassModification = (e) => {
    const isChecked = e.target.checked;
    setIsMassModification(isChecked);
    setShowMassActionButton(isChecked);
    if (!isChecked) {
      setSelectedIds([]);
      setSelectedLabels([]);
    }
  };

  const handleSaveMassEdit = () => {
    if (selectedIds.length === 0) {
      alert('Por favor, seleccione al menos una etiqueta para modificar.');
      return;
    }
    setOpenModalbulk(true);
  };

  const handleCloseModalbulk = () => {
    setOpenModalbulk(false);
    setOld_word('');
    setNew_word('');
    if (shouldSearchAgain) {
      handleSearchLabel();
      setShouldSearchAgain(false);
    }
  };

  const handleLabelSelect = (labelData, languageId) => {
    setSelectedLabels(prevLabels => {
      const isAlreadySelected = prevLabels.some(label => label.labelKey === labelData.labelKey);

      if (isAlreadySelected) {
        return prevLabels.filter(label => label.labelKey !== labelData.labelKey);
      } else {
        return [...prevLabels, labelData];
      }
    });
  };

  const handleMassSave = () => {
    if (selectedLabels.length === 0) {
      alert('Por favor, seleccione al menos una etiqueta para modificar.');
      return;
    }
    const dataToSend = {
      labels: selectedLabels.map(label => ({
        label_key: label.labelKey,
        full_label: label.label,
        old_word: old_word,
        new_word: new_word,
        languageId: label.languageId
      }))
    };
    axios.post('http://127.0.0.1:5000/modificar-masivo', dataToSend)
      .then(response => {
        console.log('Etiquetas modificadas correctamente:', response.data);
        setSnackbarMessage('Etiquetas modificadas correctamente');
        setSnackbarOpen(true);
        setSelectedLabels([]);
        setOld_word('');
        setNew_word('');
        setShouldSearchAgain(true);
        setNewLabel('');
        setOpenModalbulk(false);
        setSelectedIds([]);
      })
      .catch(error => {
        console.error('Error al modificar etiquetas:', error);
      });

    console.log('Etiquetas seleccionadas:', selectedLabels);
    console.log('Palabra a reemplazar:', old_word);
    console.log('Nueva Palabra:', new_word);
    console.log('Idioma:', LanguageId);
    console.log('Datos a enviar:', dataToSend);
  };

  const handleSave = () => {
    axios.post('http://127.0.0.1:5000/modificar', {
      labelKey: labelKey,
      newLabel: newLabel,
      languageId: LanguageId
    })
      .then(response => {
        console.log('Etiqueta modificada correctamente:', response.data);
        setSnackbarMessage('Etiqueta modificada correctamente');
        setSnackbarOpen(true);
        setSearchResults(searchResults.map(item =>
          (item.LabelKey === labelKey && item.LanguageId === LanguageId) ? { ...item, Label: newLabel } : item
        ));
        setTimeout(() => {
          setOpenModal(false);
          setNewLabel('');
        }, 2000);
      })
      .catch(error => {
        console.error('Error al modificar etiqueta:', error);
        alert('Error al modificar la etiqueta. Por favor, inténtelo de nuevo.');
      });

    console.log('Idioma:', LanguageId);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleNewLabelChange = (e) => {
    setNewLabel(e.target.value);
    setIsSaveDisabled(e.target.value === '');
  };

  const getLanguageName = (languageId) => {
    switch (languageId) {
      case 1:
        return 'Español';
      case 2:
        return 'Inglés';
      case 3:
        return 'Portugués';
      default:
        return 'Desconocido';
    }
  };

  const columns = [
    { field: 'Id', headerName: 'ID', width: 100 },
    { field: 'LabelKey', headerName: 'LabelKey', width: 400 },
    { field: 'Label', headerName: 'Label', width: 500 },
    { field: 'Module', headerName: 'Módulo', width: 150 },
    { field: 'LanguageId', headerName: 'Idioma', width: 150, renderCell: (params) => getLanguageName(params.value) },
    {
      field: 'action', headerName: 'Acciones', width: 150, sortable: false,
      renderCell: (params) => isMassModification ?
        <Checkbox
          color="primary"
          checked={selectedIds.includes(params.row.Id)}
          onChange={(e) => {
            handleCheckboxChange(e, params.row.Id);
            handleLabelSelect({ id: params.row.Id, labelKey: params.row.LabelKey, label: params.row.Label, languageId: params.row.LanguageId });
          }}
        /> :
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleModify(params.row.Label, params.row.LabelKey, params.row.LanguageId)}
        >
          <EditIcon />
        </IconButton>
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: 2 }}>
      <FormularioBusqueda onSearchResults={setSearchResults} />
        </Box>




      <Grid container sx={{ display: 'flex', marginTop: 2, marginLeft: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
            <Typography variant="body1">Edición Unitaria</Typography>
            <Switch
              checked={isMassModification}
              onChange={handleMassModification}
              color="primary"
              inputProps={{ 'aria-label': 'toggle mass modification switch' }}
            />
            <Typography variant="body1">Edición Masiva</Typography>
          </Box>
          {showMassActionButton && (
            <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveMassEdit}
              >
                Guardar Modificaciones
              </Button>
            </Box>
          )}
        </Grid>
        <div style={{ height: 'auto', width: '100%', marginTop: 20 }}>
          <CustomDataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  Id: false,
                  status: false,
                  traderName: false,
                },
              },
            }}
            rows={searchResults}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            getRowId={(row) => row.Id}
          />
        </div>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Modificar Etiqueta</DialogTitle>
          <DialogContent>
            <TextField
              label="LabelKey"
              variant="outlined"
              size="medium"
              sx={{ marginTop: 2, width: '50%' }}
              value={labelKey}
              disabled
            />
            <TextField
              label="Idioma"
              variant="outlined"
              size="medium"
              value={LanguageId === 1 ? 'Español' : LanguageId === 2 ? 'Inglés' : LanguageId === 3 ? 'Portugués' : 'Desconocido'}
              disabled
              sx={{ marginTop: 2, marginLeft: 2, width: '48%' }}
            />
            <TextField
              label="Etiqueta Actual"
              variant="outlined"
              size="medium"
              fullWidth
              sx={{ marginTop: 2, marginBottom: 2 }}
              value={currentLabel}
              disabled
            />
            <TextField
              label="Nueva Etiqueta"
              variant="outlined"
              fullWidth
              focused
              color='primary'
              value={newLabel}
              onChange={handleNewLabelChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant="outlined" color="error">
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="outlined" color="success" disabled={isSaveDisabled}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openModalbulk}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Reemplazar de manera masiva</DialogTitle>
          <DialogContent>
            <TextField
              label="Palabra a reemplazar"
              variant="outlined"
              fullWidth
              sx={{ margin: 2, width: '70%' }}
              value={old_word}
              onChange={(e) => setOld_word(e.target.value)}
            />
            <TextField
              label="Nueva Palabra"
              sx={{ margin: 2, width: '70%' }}
              variant="outlined"
              fullWidth
              value={new_word}
              onChange={(e) => setNew_word(e.target.value)}
            />
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={handleCloseModalbulk} variant="outlined" color="error">
              Cancelar
            </Button>
            <Button onClick={handleMassSave} variant="outlined" color="success">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CustomerDetails;
