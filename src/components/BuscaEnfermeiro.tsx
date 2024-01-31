import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import api from '../api';

interface BuscaEnfermeiroProps {
  onEnfermeiroSelecionado: (enfermeiroId: string) => void;
  valorInicial?: string;
}

interface BuscaEnfermeiro {
  enfermeiroId: string;
  nome: string;
}

const BuscaEnfermeiro: React.FC<BuscaEnfermeiroProps> = ({ onEnfermeiroSelecionado, valorInicial = '' }) => {
  const [enfermeiros, setEnfermeiros] = useState<BuscaEnfermeiro[]>([]);
  const [nome, setNome] = useState<string>(valorInicial || '');
  const [itemFocado, setItemFocado] = useState<number>(-1);
  const [id, setId] = useState<string>('');
  const [enfermeiroSelecionado, setEnfermeiroSelecionado] = useState<BuscaEnfermeiro | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Novo estado

  const listaRef = useRef<HTMLUListElement>(null);

  const buscarEnfermeiros = async (nome: string) => {
    try {
      const response = await api.get(`/api/Enfermeiros/buscar?nome=${nome}`);
      setEnfermeiros(response.data);
      setItemFocado(-1); // Reinicia o foco quando a lista de enfermeiros é atualizada
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

  const handleNomeSelecionado = (nome: string, enfermeiroId: string) => {
    setNome(nome);
    setId(enfermeiroId);
    setEnfermeiros([]);
    
    const enfermeiro = { nome, enfermeiroId };
    setEnfermeiroSelecionado(enfermeiro);
    
    onEnfermeiroSelecionado(enfermeiroId);
    setShowDropdown(false);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (enfermeiros.length === 0) {
      return;
    }
  
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setItemFocado((prev) => (prev < enfermeiros.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setItemFocado((prev) => (prev > 0 ? prev - 1 : enfermeiros.length - 1));
    } else if (event.key === 'Enter' && itemFocado !== -1) {
      const enfermeiro = enfermeiros[itemFocado];
      handleNomeSelecionado(enfermeiro.nome, enfermeiro.enfermeiroId);
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
        placeholder="Digite o nome do enfermeiro"
        autoComplete="profissional"
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {enfermeiros.length > 0 && (
        <ul ref={listaRef} className="absolute top-full left-0 z-1 w-full max-h-40 overflow-y-auto border border-solid border-gray-300 bg-white rounded-md text-xs">
          {enfermeiros.map((enfermeiro, index) => (
            <li
              key={enfermeiro.enfermeiroId}
              className={`block w-full py-1.5 px-3 text-gray-900 hover:bg-gray-200 cursor-pointer ${
                index === itemFocado ? 'bg-teal-500' : ''
              }`}
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

export default BuscaEnfermeiro;
