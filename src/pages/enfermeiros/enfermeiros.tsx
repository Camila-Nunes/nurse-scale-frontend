import Page from "@/components/Page";
import api from '../../api';
import { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import InputMask from "react-input-mask";
import { toast } from 'react-toastify';
import EstadoSelect from "@/components/EstadoSelect";
import CidadeSelect from "@/components/CidadeSelect";

export default function Enfermeiros() {
    const [nome, setNome] = useState('');
    const [cofen, setCofen] = useState('');
    const [cpf, setCPF] = useState('');
    const [rg, setRG] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    const [banco, setBanco] = useState('');
    const [agencia, setAgencia] = useState('');
    const [conta, setConta] = useState('');
    
    const [tipoChavePix, setTipoChavePix] = useState('');
    const [chavePix, setChavePix] = useState('');

    const [estado, setEstado] = useState<string>('');
    const [cidade, setCidade] = useState<string>('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const enfermeiro = {
            nome, 
            cofen, 
            cpf, 
            rg, 
            email, 
            telefone,
            estado,
            cidade,
            banco,
            agencia,
            conta,
            tipoChavePix,
            chavePix
        }
        try {
            const response = await api.post('/api/Enfermeiros', enfermeiro);
            toast.success("Registro salvo com sucesso.");
            router.push("/enfermeiros/listar-enfermeiros");
        } catch (error) {
            console.error(error);
            toast.error("Não foi possível salvar o registro.");
        }
    };

    async function handleCancel (){
        router.push(`/enfermeiros/listar-enfermeiros`);
    };

    return (
        <Page titulo="Cadastro de Enfermeiros">
            <form onSubmit={handleSubmit} className="container max-w-full">
                <Link href="/enfermeiros/listar-enfermeiros"> 
                    <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>   
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
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value.toUpperCase())}
                                        autoComplete="nome"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="cofen" className="block text-sm font-medium leading-6 text-gray-900">Nº COFEN</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="cofen"
                                        id="cofen"
                                        value={cofen}
                                        onChange={(e) => setCofen(e.target.value)}
                                        autoComplete="cofen"
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
                            <div className="sm:col-span-2">
                                <EstadoSelect onSelect={setEstado}/>
                            </div>
                            <div className="sm:col-span-3">
                                <CidadeSelect estado={estado} onSelect={setCidade}/>
                            </div>
                            <div className="col-span-5">
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

                            <div className="col-span-2">
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
                            <div className="sm:col-span-full">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Dados para pagamento</h2>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Tipo Chave Pix</label>
                                <div className="mt-2">
                                    <select
                                    id="banco"
                                    name="banco"
                                    value={tipoChavePix}
                                    onChange={(e) => setTipoChavePix(e.target.value)}
                                    autoComplete="banco"
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option value="Selecione um Tipo de Chave">Selecione um Tipo de Chave</option>
                                        <option value="CPF">CPF</option>
                                        <option value="Email">Email</option>
                                        <option value="Telefone">Telefone</option>
                                        <option value="ChaveAleatoria">Chave Aleatória</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="sm:col-span-4">
                                <label htmlFor="chave-pix" className="block text-sm font-medium leading-6 text-gray-900">Chave PIX</label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="chave-pix"
                                    id="chave-pix"
                                    value={chavePix}
                                    onChange={(e) => setChavePix(e.target.value)}
                                    autoComplete="chave-pix"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Banco</label>
                                <div className="mt-2">
                                    <select
                                        id="banco"
                                        name="banco"
                                        autoComplete="banco"
                                        value={banco}
                                        onChange={(e) => setBanco(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option value="Selecione um Banco">Selecione um Banco</option>
                                        <option value="Bradesco">Bradesco</option>
                                        <option value="Itau">Itaú</option>
                                        <option value="Santander">Santander</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="agencia" className="block text-sm font-medium leading-6 text-gray-900">Agência</label>
                                <div className="mt-2">
                                    <input 
                                        type="text"
                                        name="agencia"
                                        id="agencia"
                                        value={agencia}
                                        onChange={(e) => setAgencia(e.target.value)}
                                        autoComplete="agencia"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="conta" className="block text-sm font-medium leading-6 text-gray-900">Conta</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="conta"
                                        id="conta"
                                        value={conta}
                                        onChange={(e) => setConta(e.target.value)}
                                        autoComplete="conta"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>  
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
                        <button type="submit" className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm">Salvar</button>
                    </div>    
                </div>
            </form>      
        </Page>
    )
}