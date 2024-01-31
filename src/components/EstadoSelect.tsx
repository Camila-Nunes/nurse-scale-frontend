// components/EstadoSelect.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const EstadoSelect: React.FC<{ onSelect: (estado: string) => void }> = ({ onSelect }) => {
  const [estados, setEstados] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar estados:', error);
      });
  }, []);

  const handleEstadoChange = (selectedOption: any) => {
    onSelect(selectedOption.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">Estado:</label>
      <Select
        options={estados.map((estado) => ({
          label: estado.sigla,
          value: estado.sigla,
        }))}
        onChange={handleEstadoChange}
        placeholder="Selecione um estado"
        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
      />
    </div>
  );
};

export default EstadoSelect;
