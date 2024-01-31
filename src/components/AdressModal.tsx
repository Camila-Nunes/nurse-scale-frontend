import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import api from '../api';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientCode: string;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, clientCode }) => {
  const [address, setAddress] = useState<string>('');
  const [pacienteId, setPacienteId] = useState(clientCode);
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const router = useRouter();

  const handleSaveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const address = {
      pacienteId,
      cep,
      logradouro,
      numero,
      bairro,
      localidade,
      uf,
      complemento
    }

    console.log(address);

    try {
        const response = await api.post('/api/Endereco', address);
        console.log(response.data);
        toast.success("Endereco salvo com sucesso.");
        //router.push("/pacientes/listarPacientes");
    } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar endereço.");
    }
};

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } : any = event.target;
    setAddress((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
};

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCep(event.target.value);
  };

  const handleCepSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        console.log(data);
        setAddress(data);
        setLogradouro(data.logradouro);        
        setBairro(data.bairro);
        setLocalidade(data.localidade);
        setUf(data.uf);
        } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setLogradouro('CEP não encontrado');
    }
  };

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="z-50 bg-white p-6 rounded-lg shadow-lg">
              <div className="z-50 bg-white p-6 rounded-lg shadow-lg">
                <h5 className="text-lg">Digite o CEP para carregar as informações do endereço:</h5>
                  <div className="sm:col-span-2">
                    <label htmlFor="cep" className="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="cep"
                        id="cep"
                        value={cep}
                        onChange={handleCepChange}
                        autoComplete="cep"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-1 mt-6">  
                    <button type="button" className="bg-slate-300 hover:bg-slate-400 text-black text-sm font-semibold py-2 px-4 w-full rounded">Buscar Cep</button>             
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="endereco" className="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                    <div className="mt-2">
                        <input
                          type="text"
                          name="endereco"
                          id="endereco"
                          value={logradouro}
                          onChange={handleInputChange}
                          autoComplete="endereco"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                          disabled
                        />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="complemento" className="block text-sm font-medium leading-6 text-gray-900">Complemento</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="complemento"
                            id="complemento"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            autoComplete="complemento"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="numero" className="block text-sm font-medium leading-6 text-gray-900">Número</label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="numero"
                        id="numero"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        autoComplete="numero"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                  </div>

                  <div className="sm:col-span-7">
                    <label htmlFor="bairro" className="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="bairro"
                        id="bairro"
                        value={bairro}
                        onChange={handleInputChange}
                        autoComplete="bairro"
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        disabled
                        />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                    <div className="mt-2">
                        <select
                        id="cidade"
                        name="cidade"
                        value={localidade}
                        autoComplete="cidade"
                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        disabled
                        >
                            <option value="Selecione uma Cidade">Selecione uma Cidade</option>
                            <option>Jundiaí</option>
                            <option>Campinas</option>
                            <option>Curitiba</option>
                        </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="estado" className="block text-sm font-medium leading-6 text-gray-900">Estado</label>
                    <div className="mt-2">
                      <select
                          id="estado"
                          name="estado"
                          value={uf}
                          autoComplete="estado"
                          className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          disabled
                        >
                          <option value="UF">UF</option>
                          <option value="SP">SP</option>
                          <option value="RJ">RJ</option>
                          <option value="ES">ES</option>
                          <option value="PR">PR</option>
                          <option value="ES">SC</option>
                          <option value="RS">RS</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-6">
                    <button type="button" onClick={onClose} className="bg-red-900 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 mr-2 rounded">Fechar</button>
                    <button type="button" className="bg-cyan-900 hover:bg-cyan-700 text-white text-sm font-semibold py-2 px-4 rounded">Salvar</button>
                  </div>
              </div> 
            </div>
          </div>
    </div>
  );
};

export default AddressModal;
