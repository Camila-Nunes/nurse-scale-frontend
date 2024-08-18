import Page from "@/components/Page";
import { useRouter } from 'next/router';
import { useState } from "react";
import api from '../../api';
import Link from "next/link";
import InputMask from "react-input-mask";
import { Slide, Flip, toast } from 'react-toastify';
import EstadoSelect from "@/components/EstadoSelect";
import CidadeSelect from "@/components/CidadeSelect";
import ModalAviso from "@/components/ModalAviso";

export default function Clientes() {
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCNPJ] = useState('');
    const [inscricaoEstadual, setInscricaoEstadual] = useState('');
    const [emailPrincipal, setEmailPrincipal] = useState('');
    const [telefonePrincipal, setTelefonePrincipal] = useState('');
    const [estado, setEstado] = useState<string>('');
    const [cidade, setCidade] = useState<string>('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mensagemModal, setMensagemModal] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const [errors, setErrors] = useState({
        razaoSocial: false,
        nomeFantasia: false,
        cnpj: false,
        inscricaoEstadual: false,
        emailPrincipal: false,
        telefonePrincipal: false,
        estado: false,
        cidade: false
    });

    const router = useRouter();

    const isFormValid = () => {
        return (
            razaoSocial.trim() !== '' &&
            nomeFantasia.trim() !== '' &&
            emailPrincipal.trim() !== '' &&
            telefonePrincipal.trim() !== '' &&
            estado.trim() !== '' &&
            cidade.trim() !== ''
        );
    };

    const handleBlur = (field: string) => {
        if (!eval(field).trim()) {
            setErrors((prev) => ({ ...prev, [field]: true }));
        } else {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const cliente = {
            razaoSocial,
            nomeFantasia,
            cnpj,
            inscricaoEstadual,
            emailPrincipal,
            telefonePrincipal,
            estado,
            cidade,
        };

        try {
            const response = await api.post('/api/Clientes', cliente);
            toast.success(`Cliente ${cliente.nomeFantasia} salvo com sucesso.`, {
                transition: Slide,
                icon: false
            });
            router.push("/clientes/listar-clientes");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar cliente: " + cliente.nomeFantasia, {
                transition: Slide,
                icon: false
            });
            setMensagemModal("Erro ao salvar Cliente.");
            setMostrarModal(true);
            setSucesso(false);
        }
    };

    async function handleCancel() {
        router.push(`/clientes/listar-clientes`);
    };

    return (
        <Page titulo="Cadastro de Empresas">
            <form onSubmit={handleSubmit} className="container max-w-full">
                <Link href="/clientes/listar-clientes">
                    <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>
                </Link>
                <div className="container mx-auto">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                            <div className="sm:col-span-3">
                                <label htmlFor="razao-social" className="block text-sm font-medium leading-6 text-gray-900">Razão Social</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="razao-social"
                                        id="razao-social"
                                        value={razaoSocial}
                                        onChange={(e) => setRazaoSocial(e.target.value.toUpperCase())}
                                        onBlur={() => handleBlur('razaoSocial')}
                                        autoComplete="given-name"
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.razaoSocial ? 'border-red-500' : ''}`}
                                    />
                                    {errors.razaoSocial && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="nome-empresa" className="block text-sm font-medium leading-6 text-gray-900">Nome Empresa</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="nome-empresa"
                                        id="nome-empresa"
                                        value={nomeFantasia}
                                        onChange={(e) => setNomeFantasia(e.target.value.toUpperCase())}
                                        onBlur={() => handleBlur('nomeFantasia')}
                                        autoComplete="family-name"
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.nomeFantasia ? 'border-red-500' : ''}`}
                                    />
                                    {errors.nomeFantasia && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="cnpj" className="block text-sm font-medium leading-6 text-gray-900">CNPJ</label>
                                <div className="mt-2">
                                    <InputMask mask="99.999.999/9999-99"
                                        type="text"
                                        name="cnpj"
                                        id="first-cnpj"
                                        value={cnpj}
                                        onChange={(e) => setCNPJ(e.target.value)}
                                        onBlur={() => handleBlur('cnpj')}
                                        autoComplete="given-name"
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.cnpj ? 'border-red-500' : ''}`}
                                    />
                                    {errors.cnpj && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="inscricao-estadual" className="block text-sm font-medium leading-6 text-gray-900">Inscrição Estadual</label>
                                <div className="mt-2">
                                    <InputMask mask="999.999.999.999"
                                        type="text"
                                        name="inscricao-estadual"
                                        id="inscricao-estadual"
                                        value={inscricaoEstadual}
                                        onChange={(e) => setInscricaoEstadual(e.target.value)}
                                        onBlur={() => handleBlur('inscricaoEstadual')}
                                        autoComplete="family-name"
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.inscricaoEstadual ? 'border-red-500' : ''}`}
                                    />
                                    {errors.inscricaoEstadual && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                                </div>
                            </div>

                            <div className="col-span-5">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={emailPrincipal}
                                        onChange={(e) => setEmailPrincipal(e.target.value)}
                                        onBlur={() => handleBlur('emailPrincipal')}
                                        autoComplete="email"
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.emailPrincipal ? 'border-red-500' : ''}`}
                                    />
                                    {errors.emailPrincipal && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="telefone" className="block text-sm font-medium leading-6 text-gray-900">Telefone(Whatsapp)</label>
                                <div className="mt-2">
                                    <InputMask mask="(99) 9 9999-9999"
                                        id="telefone"
                                        name="telefone"
                                        type="telefone"
                                        value={telefonePrincipal}
                                        onChange={(e) => setTelefonePrincipal(e.target.value)}
                                        onBlur={() => handleBlur('telefonePrincipal')}
                                        autoComplete="telefone"
                                        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.telefonePrincipal ? 'border-red-500' : ''}`}
                                    />
                                    {errors.telefonePrincipal && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <EstadoSelect onSelect={setEstado}/>
                                {errors.estado && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                            </div>
                            <div className="sm:col-span-3">
                                <CidadeSelect estado={estado} onSelect={setCidade}/>
                                {errors.cidade && <p className="text-red-500 text-xs mt-1">Este campo é obrigatório.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
                        <button type="submit" className={`text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm ${
                            !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
                        }`} disabled={!isFormValid()}>Salvar</button>
                    </div>
                </div>
            </form>
        </Page>
    );
}
