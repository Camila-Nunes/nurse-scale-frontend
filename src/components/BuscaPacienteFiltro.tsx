import React, { useState, ChangeEvent, useEffect } from 'react';
import api from '../api';

interface BuscaPacienteFiltroProps {
  onPacienteSelecionado: (pacienteId: string) => void;
  valorInicial?: string;
}

interface BuscaPacienteFiltro {
  pacienteId: string;
  nome: string;
}

const BuscaPacienteFiltro: React.FC<BuscaPacienteFiltroProps> = ({ onPacienteSelecionado, valorInicial = '' }) => {
  const [pacientes, setPacientes] = useState<BuscaPacienteFiltro[]>([]);
  const [nome, setNome] = useState<string>(valorInicial || '');
  const [id, setId] = useState<string>('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<BuscaPacienteFiltro | null>(null);
  const [emEdicao, setEmEdicao] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Novo estado

  const buscarPacientes = async (nome: string) => {
    try {
      const response = await api.get(`/api/Pacientes/buscar?nome=${nome}`);
      setPacientes(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Erro ao buscar Paciente:', error);
    }
  };

  const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const novoNome = event.target.value;
    setNome(novoNome);

    if (novoNome.length >= 1) {
      buscarPacientes(novoNome);
    } else {
      setPacientes([]);
      setShowDropdown(false);
    }
  };

  const handleNomeSelecionado = (nome: string, id: string) => {
    const paciente = { nome, pacienteId: id };
    setNome(nome);
    setId(id);
    setPacientes([]);
    setPacienteSelecionado(paciente);
    onPacienteSelecionado(id);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={nome}
        data-id={id}
        onChange={handleNomeChange}
        placeholder="Digite o nome do Paciente"
        id="paciente"
        name="paciente"
        autoComplete="off"
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 z-10 w-full max-h-40 overflow-y-auto border border-solid border-gray-300 bg-white rounded-md text-xs">
          {pacientes.map((paciente) => (
            <li
              key={paciente.pacienteId}
              className="block w-full py-1.5 px-3 text-gray-900 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleNomeSelecionado(paciente.nome, paciente.pacienteId)}
            >
              {paciente.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscaPacienteFiltro;
