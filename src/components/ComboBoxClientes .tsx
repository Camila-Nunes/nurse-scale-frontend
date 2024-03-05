import React, { useEffect, useState } from 'react';
import api from '@/api';

interface ComboboxClientesProps {
  onSelectCliente: (clienteId: string, nomeFantasia: string) => void;
  isEditMode?: boolean;
  defaultValue?: string;
}

interface Cliente {
  clienteId: string;
  nomeFantasia: string;
}

const ComboBoxClientes: React.FC<ComboboxClientesProps> = ({
  onSelectCliente,
  isEditMode = false,
  defaultValue = '',
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const response = await api.get<Cliente[]>('/api/Clientes/buscar');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };

    carregarClientes();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setSelectedValue(defaultValue);
    }
  }, [isEditMode, defaultValue]);

  return (
    <select
      value={selectedValue}
      onChange={(e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find((c) => c.clienteId === clienteId);
        if (cliente) {
          setSelectedValue(clienteId);
          onSelectCliente(clienteId, cliente.nomeFantasia);
        }
      }}
      disabled={isEditMode}
      className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
    >
      {!isEditMode && <option value="">Selecione uma empresa</option>}
      {clientes.map((cliente) => (
        <option key={cliente.clienteId} value={cliente.clienteId}>
          {cliente.nomeFantasia}
        </option>
      ))}
    </select>
  );
};

export default ComboBoxClientes;