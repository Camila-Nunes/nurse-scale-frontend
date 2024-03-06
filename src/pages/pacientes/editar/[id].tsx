import Page from "@/components/Page";
import AddressModal from "@/components/AdressModal";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../api';
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import Link from "next/link";
import moment from 'moment';
import axios from 'axios';
import { CgSpinnerTwo } from "react-icons/cg";

export default function Editarpaciente() {
    const [clientes, setClientes] = useState([]);
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [registro, setRegistro] = useState<any>(null);
    const [cep, setCep] = useState('');

    const [registroCep, setRegistroCep] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientCode, setClientCode] = useState('');

    const handleInputCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = e.target.value;
        setCep(newCep);
      };

    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCep(event.target.value);
    };
    
    const handleCepSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;
            setRegistroCep(data);
            // Atualize os campos com os novos valores do CEP
            setRegistro((prevData: any) => ({
                ...prevData,
                cep: data.cep,
                endereco: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
            }));

            console.log(registroCep);
            } catch (error) {
            toast.error('Erro ao buscar CEP');
            setRegistro(null);
        }
    };
    
    async function getClientes(){
        const response = await api.get('/api/Clientes')
        .then(response => {
            setClientes(response.data.result);
        }).catch(error => {
        })
    };
    
    useEffect(() => {
        const fetchRegistro = async () => {
            try {
                const response = await api.get(`/api/Pacientes/` + id); 
                setRegistro(response.data.result);                
                setCep(response.data.result.cep);
            
            } catch (error) {
            console.error('Erro ao obter os dados do registro:', error);
            }finally {
                setIsLoading(false);
            }};

            if (id) {
                setIsLoading(true);
                setTimeout(() => {
                    fetchRegistro();
                }, 1000);
            }
        }, [id]
    );

    useEffect(()=>{
        getClientes()
    }, [clientes]);

    if (isLoading || !registro) {
        return (
          <div className="flex justify-center items-center h-screen">
            <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
          </div>
        );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } : any = event.target;
        setRegistro((prevData: any) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        api.put(`/api/Pacientes/${id}`, registro)
        .then(() => {
            toast.success(`Paciente ${registro.nome} atualizado com sucesso.`)
            router.push("/pacientes/listar-pacientes");
        })
        .catch((error) => {
            toast.error(`Erro ao atualizar paciente: ${registro.nome} `, error);
        });
    }; 
    
    async function handleCancel (){
        router.push(`/pacientes/listar-pacientes`);
    };

    if (!registro) {
        return <div>Carregando...</div>;
    }

  return (
    <Page titulo="Editar Paciente">
        <form onSubmit={handleSubmit} className="container max-w-full">
            <Link href="/pacientes/listar-pacientes">
                <button type="button" className="rounded-md bg-teal-600 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>   
            </Link>
            <div className="container mx-auto">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                        <div className="sm:col-span-6">
                            <label htmlFor="nome" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="nome"
                                    id="nome"
                                    defaultValue={registro.nome}
                                    onChange={handleInputChange}
                                    autoComplete="nome"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="dataNascimento" className="block text-sm font-medium leading-6 text-gray-900">Data de Nascimento</label>
                                <div className="mt-2">
                                <input
                                    type="date"
                                    name="dataNascimento"
                                    id="dataNascimento"
                                    defaultValue={moment(registro.dataNascimento).format('YYYY-MM-DD')}
                                    onChange={handleInputChange}
                                    autoComplete="data-nascimento"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="cpf" className="block text-sm font-medium leading-6 text-gray-900">CPF</label>
                            <div className="mt-2">
                            <InputMask mask="999.999.999-99" 
                                    type="text"
                                    name="cpf"
                                    id="cpf"
                                    defaultValue={registro.cpf}
                                    onChange={handleInputChange}
                                    autoComplete="cpf"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="rg" className="block text-sm font-medium leading-6 text-gray-900">RG</label>
                                <div className="mt-2">
                                    <InputMask mask="99.999.999-9" 
                                        type="text"
                                        name="rg"
                                        id="rg"
                                        defaultValue={registro.rg}
                                        onChange={handleInputChange}
                                        autoComplete="rg"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                    />    
                            </div>
                        </div>

                        <div className="col-span-7">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                            <div className="mt-2">
                                <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={registro.email}
                                onChange={handleInputChange}
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="col-span-3">
                            <label htmlFor="telefone" className="block text-sm font-medium leading-6 text-gray-900">Telefone(Whatsapp)</label>
                            <div className="mt-2">
                                <InputMask mask="(99) 9 9999-9999" 
                                    id="telefone"
                                    name="telefone"
                                    type="telefone"
                                    defaultValue={registro.telefone}
                                    onChange={handleInputChange}
                                    autoComplete="telefone"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="clienteId" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
                            <div className="mt-2">
                                <select
                                    id="clienteId"
                                    name="clienteId"
                                    autoComplete="clienteId"
                                    defaultValue={registro.clienteId}   
                                    //onChange={handleInputChange}
                                    className="block rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 w-full focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                    <option value="Selecione uma Empresa">Selecione uma Empresa</option>
                                    {clientes && clientes.map((cliente: any) => (
                                        <option value={cliente.clienteId} key={cliente.clienteId}>{cliente.nomeFantasia}</option> 
                                    ))}             
                                </select>
                            </div>
                        </div>

                        <hr className="col-span-full" />
                        <div className="sm:col-span-2">
                            <label htmlFor="cep" className="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="cep"
                                    id="cep"
                                    value={cep}
                                    //defaultValue={registro.cep}
                                    onChange={handleInputCepChange}
                                    autoComplete="cep"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                            
                        <div className="sm:col-span-1 mt-6">  
                            <button type="button" className="bg-slate-300 hover:bg-slate-400 text-black text-sm font-semibold py-2 px-4 w-full rounded" onClick={handleCepSubmit}>Buscar Cep</button>             
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="endereco" className="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                            <div className="mt-2">
                                <input
                                type="text"
                                name="endereco"
                                id="endereco"
                                value={registroCep ? registroCep.logradouro : registro.endereco}
                                //defaultValue={registro.endereco}
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
                                    defaultValue={registro.complemento}
                                    onChange={handleInputChange}
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
                                defaultValue={registro.numero}
                                onChange={handleInputChange}
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
                                    value={registroCep ? registroCep.bairro : registro.bairro}
                                    onChange={handleInputChange}
                                    autoComplete="bairro"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4 ">
                            <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="cidade"
                                    id="cidade"
                                    value={registroCep ? registroCep.localidade : registro.cidade}
                                    onChange={handleInputChange}
                                    autoComplete="cidade"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="uf" className="block text-sm font-medium leading-6 text-gray-900">Estado</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    value={registroCep ? registroCep.uf : registro.estado}
                                    onChange={handleInputChange}
                                    autoComplete="estado"
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    disabled
                                />
                            </div>                           
                        </div>
                        <div className="flex items-center justify-end gap-x-6 col-span-full">
                            <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
                            <button type="submit" className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm">Salvar</button>
                        </div>
                    </div>
                </div>    
            </div>
        </form>  
          
    </Page>
  );
};