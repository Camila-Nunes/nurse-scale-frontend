import React, { useState, ChangeEvent, useEffect } from 'react';
import api from '../api';

interface BuscaEnfermeiroFiltroProps {
  onEnfermeiroSelecionado: (enfermeiroId: string) => void;
  valorInicial?: string;
}

interface BuscaEnfermeiroFiltro {
  enfermeiroId: string;
  nome: string;
}

const BuscaEnfermeiroFiltro: React.FC<BuscaEnfermeiroFiltroProps> = ({ onEnfermeiroSelecionado, valorInicial = '' }) => {
  const [enfermeiros, setEnfermeiros] = useState<BuscaEnfermeiroFiltro[]>([]);
  const [nome, setNome] = useState<string>(valorInicial || '');
  const [id, setId] = useState<string>('');
  const [enfermeiroSelecionado, setEnfermeiroSelecionado] = useState<BuscaEnfermeiroFiltro | null>(null);
  const [emEdicao, setEmEdicao] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Novo estado

  const buscarEnfermeiros = async (nome: string) => {
    try {
      const response = await api.get(`/api/Enfermeiros/buscar?nome=${nome}`);
      setEnfermeiros(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Erro ao buscar Enfermeiro:', error);
    }
  };

  const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const novoNome = event.target.value;
    setNome(novoNome);

    if (novoNome.length >= 1) {
      buscarEnfermeiros(novoNome);
    } else {
      setEnfermeiros([]);
      setShowDropdown(false);
    }
  };

  const handleNomeSelecionado = (nome: string, id: string) => {
    const enfermeiro = { nome, enfermeiroId: id };
    setNome(nome);
    setId(id);
    setEnfermeiros([]);
    setEnfermeiroSelecionado(enfermeiro);
    onEnfermeiroSelecionado(id);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={nome}
        data-id={id}
        onChange={handleNomeChange}
        placeholder="Digite o nome do enfermeiro"
        id="profissional"
        name="profissional"
        autoComplete="profissional"
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 z-1 w-full max-h-40 overflow-y-auto border border-solid border-gray-300 bg-white rounded-md text-xs">
          {enfermeiros.map((enfermeiro) => (
            <li
              key={enfermeiro.enfermeiroId}
              className="block w-full py-1.5 px-3 text-gray-900 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleNomeSelecionado(enfermeiro.nome, enfermeiro.enfermeiroId)}
            >
              {enfermeiro.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscaEnfermeiroFiltro;
