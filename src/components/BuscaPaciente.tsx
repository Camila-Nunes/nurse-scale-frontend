import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import api from '../api';

interface BuscaPacienteProps {
  onPacienteSelecionado: (paciente: BuscaPaciente) => void;
  valorInicial?: string;
}

interface BuscaPaciente {
  pacienteId: string;
  nome: string;
  endereco: string;
  estado: string;
  numero: string;
  bairro: string;
  cidade: string;
}

const BuscaPaciente: React.FC<BuscaPacienteProps> = ({ onPacienteSelecionado, valorInicial = '' }) => {
  const [pacientes, setPacientes] = useState<BuscaPaciente[]>([]);
  const [nome, setNome] = useState<string>(valorInicial || '');
  const [endereco, setEndereco] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');


  const [itemFocado, setItemFocado] = useState<number>(-1);
  const [id, setId] = useState<string>('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<BuscaPaciente | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Novo estado

  const listaRef = useRef<HTMLUListElement>(null);

  const buscarPacientes = async (nome: string) => {
    try {
      const response = await api.get(`/api/Pacientes/buscar?nome=${nome}`);
      setPacientes(response.data);
      setItemFocado(-1); // Reinicia o foco quando a lista de Pacientes é atualizada
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

  const handleNomeSelecionado = (nome: string, pacienteId: string, endereco: string, numero: string, bairro: string, cidade: string, estado: string) => {
    setNome(nome);
    setId(pacienteId);
    setEndereco(endereco);
    setEstado(estado);
    setNumero(numero);
    setBairro(bairro);
    setCidade(cidade);

    setPacientes([]);
  
    // Aqui você cria o objeto Paciente completo
    const paciente: BuscaPaciente = {
      pacienteId,
      nome,
      endereco,
      estado,
      numero,
      bairro,
      cidade
    };
  
    setPacienteSelecionado(paciente);
  
    // Passe o objeto completo para o componente pai
    onPacienteSelecionado(paciente);
    setShowDropdown(false);
  };
  
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (pacientes.length === 0) {
      return;
    }
  
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setItemFocado((prev) => (prev < pacientes.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setItemFocado((prev) => (prev > 0 ? prev - 1 : pacientes.length - 1));
    } else if (event.key === 'Enter' && itemFocado !== -1) {
      const paciente = pacientes[itemFocado];
      handleNomeSelecionado(paciente.nome, paciente.pacienteId, paciente.endereco, paciente.numero, paciente.bairro, paciente.cidade, paciente.estado);
    }
  };

  useEffect(() => {
    if (listaRef.current && itemFocado !== -1) {
      const focusedItem = listaRef.current.childNodes[itemFocado] as HTMLElement;
      focusedItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [itemFocado]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={nome}
        onChange={handleNomeChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite o nome do paciente"
        autoComplete="paciente"
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {pacientes.length > 0 && (
        <ul ref={listaRef} className="absolute top-full left-0 z-1 w-full max-h-40 overflow-y-auto border border-solid border-gray-300 bg-white rounded-md text-xs">
          {pacientes.map((paciente, index) => (
            <li
              key={paciente.pacienteId}
              className={`block w-full py-1.5 px-3 text-gray-900 hover:bg-gray-200 cursor-pointer ${
                index === itemFocado ? 'bg-teal-500' : ''
              }`}
              onClick={() => handleNomeSelecionado(paciente.nome, paciente.pacienteId, paciente.endereco, paciente.numero, paciente.bairro, paciente.cidade, paciente.estado)}
            >
              {paciente.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscaPaciente;
