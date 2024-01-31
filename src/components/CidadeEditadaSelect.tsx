// components/CidadeSelect.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CidadeEditadaSelect: React.FC<{ estado: string; onSelect: (cidade: string) => void; cidadeInicial: string }> = ({
  estado,
  onSelect,
  cidadeInicial,
}) => {
  const [cidades, setCidades] = useState<any[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string | null>(cidadeInicial || null);

  useEffect(() => {
    if (estado) {
      axios
        .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then((response) => {
          setCidades(response.data);
        })
        .catch((error) => {
          console.error('Erro ao buscar cidades:', error);
        });
    }
  }, [estado]);

  useEffect(() => {
    if (cidadeInicial) {
      // Configurar a cidade inicial quando ela for recebida
      setCidadeSelecionada(cidadeInicial);
    }
  }, [cidadeInicial]);

  const handleCidadeChange = (selectedOption: any) => {
    onSelect(selectedOption.value);
    setCidadeSelecionada(selectedOption.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">Cidade:</label>
      <Select
        value={cidadeSelecionada ? { label: cidadeSelecionada, value: cidadeSelecionada } : null}
        options={cidades.map((cidade) => ({
          label: cidade.nome,
          value: cidade.nome,
        }))}
        onChange={handleCidadeChange}
        placeholder="Selecione uma cidade"
        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
      />
    </div>
  );
};

export default CidadeEditadaSelect;

