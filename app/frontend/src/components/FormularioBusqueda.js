import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem } from '@mui/material';

const FormularioBusqueda = ({ onSearchResults }) => {
    const [searchTermLabelKey, setSearchTermLabelKey] = useState('');
    const [searchTermLabel, setSearchTermLabel] = useState('');
    const [searchTermModule, setSearchTermModule] = useState('');
    const [languageId, setLanguageId] = useState(4); // 4 representa "Todos los idiomas"

    const handleSearch = () => {
        const params = {
            labelKey: searchTermLabelKey,
            label: searchTermLabel,
            module: searchTermModule,
            languageId: languageId
        };

        axios.get('http://127.0.0.1:5000/filtro-dinamico', { params })
            .then(response => {
                onSearchResults(response.data);  
            })
            .catch(error => {
                console.error('Error al realizar la búsqueda:', error);
                onSearchResults([]);  
            });
    };

    return (
        <div style={{ marginTop: 50 }}>
            <TextField
                label="Etiqueta"
                value={searchTermLabel}
                onChange={e => setSearchTermLabel(e.target.value)}
                sx={{ marginRight: 2 }}
                size='small'


            />
            <TextField
                label="Label Key"
                value={searchTermLabelKey}
                onChange={e => setSearchTermLabelKey(e.target.value)}
                sx={{ marginRight: 2 }}
                size='small'

            />
            <TextField
                label="Modulo"
                value={searchTermModule}
                onChange={e => setSearchTermModule(e.target.value)}
                sx={{ marginRight: 2 }}
                size='small'


            />
            
            <Select
                value={languageId}
                onChange={e => setLanguageId(e.target.value)}
                displayEmpty
                sx={{ marginRight: 2, width: 150}}
                size='small'
                

            >
                <MenuItem value={1}>Español</MenuItem>
                <MenuItem value={2}>Inglés</MenuItem>
                <MenuItem value={3}>Portugués</MenuItem>
                <MenuItem value={4}>Todos</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleSearch}>Buscar</Button>
        </div>
    );
};

export default FormularioBusqueda;
