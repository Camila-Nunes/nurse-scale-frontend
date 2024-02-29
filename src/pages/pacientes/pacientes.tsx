import Page from "@/components/Page";
import api from '../../api';
import { useEffect, useState } from "react";
import Link from "next/link";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import axios from 'axios';
import ComboBoxClientes from "@/components/ComboBoxClientes ";


export default function Pacientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState<string>('');
    const [cpf, setCPF] = useState('');
    const [rg, setRG] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const router = useRouter();

    async function getClientes(){
        const response = await api.get('/api/Clientes')
        .then(response => {
            setClientes(response.data.result);
        }).catch(error => {
        })
    };

    async function handleCancel (){
        router.push(`/pacientes/listar-pacientes`);
    };

    const handleCepSubmit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;
            console.log(data);
            setEndereco(data.logradouro);        
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);
            } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setEndereco('CEP não encontrado');
        }
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const paciente = {
            clienteId, 
            nome, 
            dataNascimento,
            cpf, 
            rg,
            email, 
            telefone,
            cep,
            endereco,
            complemento,
            numero,
            bairro,
            cidade,
            estado
        }

        console.log(paciente);

        try {
            const response = await api.post('/api/Pacientes', paciente);
            console.log(response.data);
            toast.success(`Paciente ${paciente.nome} salvo com sucesso.`);
            router.push("/pacientes/listar-pacientes");
        } catch (error) {
            console.error(error);
            toast.error(`Erro ao salvar paciente: ${paciente.nome}.`);
        }
    };

    useEffect(()=>{
        getClientes()
    }, [clientes])

    const handleSelectCliente = (selectedClienteId: string, nomeFantasia: string) => {
        setClienteId(selectedClienteId);
        console.log(selectedClienteId);
      };

    return (
        <Page titulo="Cadastro de Pacientes">
            <form onSubmit={handleSubmit} className="container max-w-full">
                <Link href="/pacientes/listar-pacientes">
                    <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>     
                </Link>
                <div className="container mx-auto">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                            <div className="sm:col-span-6">
                                <label htmlFor="nome" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="nome"
                                        id="nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value.toUpperCase())}
                                        autoComplete="nome"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="data-nascimento" className="block text-sm font-medium leading-6 text-gray-900">Data de Nascimento</label>
                                    <div className="mt-2">
                                    <input
                                        type="date"
                                        name="data-nascimento"
                                        id="data-nascimento"
                                        value={dataNascimento}
                                        onChange={(e) => setDataNascimento(e.target.value)}
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
                                        value={cpf}
                                        onChange={(e) => setCPF(e.target.value)}
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
                                            value={rg}
                                            onChange={(e) => setRG(e.target.value)}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        autoComplete="telefone"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="empresa" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
                                <div className="mt-2">
                                    <ComboBoxClientes onSelectCliente={handleSelectCliente} />
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
                                        onChange={(e) => setCep(e.target.value)}
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
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value.toUpperCase())}
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
                                        onChange={(e) => setComplemento(e.target.value.toUpperCase())}
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
                                    onChange={(e) => setBairro(e.target.value.toUpperCase())}
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
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value.toUpperCase())}
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
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    autoComplete="estado"
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    disabled
                                />
                            </div>                           
                        </div>   
                            
                            <div className="flex items-center justify-end gap-x-6 col-span-full">
                                <button type="button" onClick={handleCancel} className="bg-transparent hover:bg-red-700 text-red-700 text-sm font-semibold py-2 px-4 rounded-md hover:text-white border border-red-700 hover:border-transparent">Cancelar</button>
                                <button type="submit" className="rounded-md bg-teal-600 hover:bg-teal-800 px-8 py-2 text-sm font-semibold leading-6 text-white">Salvar</button>
                            </div>
                        </div>
                    </div>    
                </div>
            </form>      
        </Page>
    )
}