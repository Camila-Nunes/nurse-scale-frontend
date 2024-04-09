import Page from "@/components/Page";
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import api from '../../api';
import Link from "next/link";
import {Slide, Flip, toast } from 'react-toastify';
import BuscaEnfermeiro from "@/components/BuscaEnfermeiro";
import BuscaPaciente from "@/components/BuscaPaciente";
import ComboBoxClientes from "@/components/ComboBoxClientes ";
import Botoes from "@/components/utils/botoes";

interface AtendimentoProps {
    // Outras propriedades necessárias para o componente de Atendimento
  }

const Atendimentos: React.FC<AtendimentoProps> = () => {
    const [clienteId, setClienteId] = useState<string>('');
    const [pacienteId, setPacienteId] = useState('');
    const [enfermeiroId, setEnfermeiroId] = useState('');
    const [dataInicial, setDataInicial] = useState<string>('');
    const [dataFinal, setDataFinal] = useState<string>('');
    const [statusAtendimento, setStatusAtendimento] = useState('');
    const [localAtendimento, setLocalAtendimento] = useState('');
    const [estadoAtendimento, setEstadoAtendimento] = useState('');
    const [assistencia, setAssistencia] = useState('');
    const [valorEmpresa, setValorEmpresa] = useState('');
    const [valorProfissional, setValorProfissional] = useState('');
    const [diaPago, setDiaPago] = useState(false);
    const router = useRouter();

    const isFormValid = () => {
        return (
            pacienteId !== '' &&
            enfermeiroId !== '' &&
            clienteId !== '' &&
            dataInicial !== '' &&
            dataFinal !== '' &&
            statusAtendimento !== '' &&
            localAtendimento !== '' &&
            estadoAtendimento !== '' &&
            assistencia !== '' &&
            valorEmpresa !== '' &&
            valorProfissional !== ''
        );

    };

    useEffect(() => {
        if (parseFloat(valorProfissional) > parseFloat(valorEmpresa)) {
            toast.warning('O valor profissional não pode ser maior que o valor da empresa.');
        }
      }, [valorEmpresa, valorProfissional]);

    const handleDataInicialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataInicial(e.target.value);
    };
    
    const handleDataFinalChange = (e: any) => {
        const newDataFinal = e.target.value;
        if (newDataFinal < dataInicial) {
            toast.warning('A Data Final deve ser maior ou igual à Data Inicial');
            setDataFinal('');
        } else {
            setDataFinal(newDataFinal);
        }
    };

    const handleCheckboxChange = () => {
        setDiaPago(!diaPago);
    };

    const handleSelectCliente = (selectedClienteId: string, nomeFantasia: string) => {
        setClienteId(selectedClienteId);
        console.log(selectedClienteId);
      };

    const handlePacienteSelecionado = (id: string) => {
        setPacienteId(id);
    };  
    
    const handleEnfermeiroSelecionado = (id: string) => {
        setEnfermeiroId(id);
    }; 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const atendimento = {
            pacienteId, 
            enfermeiroId, 
            clienteId, 
            dataInicial, 
            dataFinal, 
            statusAtendimento,
            localAtendimento,
            estadoAtendimento,
            assistencia,
            valorEmpresa,
            valorProfissional,
            diaPago
        };

        if (parseFloat(valorProfissional) >= parseFloat(valorEmpresa)) {
            toast.warning('Valor Profissional não pode ser maior ou igual que Valor Empresa.');
            return; 

            setValorEmpresa('');
            setValorProfissional('');
        };
    
        if (new Date(dataFinal) < new Date(dataInicial)) {
            toast.warning('A data final não pode ser menor que a data inicial.');
            return;
        };

        try {
            const response = await api.post('/api/Atendimentos', atendimento);
            console.log(atendimento);
            toast.success(`Atendimento salvo com sucesso.`, {
                transition: Slide,
                icon: true
            });
            router.push("/atendimentos/listar-atendimentos");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar atendimento.", {
                transition: Slide,
                icon: false
            });
        }
    };
    
    async function handleCancel (){
        router.push(`/atendimentos/listar-atendimentos`);
    };

    return (
        <Page titulo="Cadastro de Atendimentos">
            <form onSubmit={handleSubmit} className="container max-w-full">
                <Link href="/atendimentos/listar-atendimentos">
                    <button type="button" className="rounded-md bg-teal-600 px-10 py-2 text-sm font-semibold leading-6 text-white">Voltar</button>     
                </Link>
                <div className="container mx-auto">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">

                            <div className="sm:col-span-8">
                                <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
                                <div className="mt-2">
                                    <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="dataInicial" className="block text-sm font-medium leading-6 text-gray-900">
                                    Data Inicial
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        name="dataInicial"
                                        id="dataInicial"
                                        value={dataInicial}
                                        onChange={handleDataInicialChange}
                                        autoComplete="data-inicial"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="dataFinal" className="block text-sm font-medium leading-6 text-gray-900">
                                Data Final
                                </label>
                                <div className="mt-2">
                                <input
                                    type="date"
                                    name="dataFinal"
                                    id="dataFinal"
                                    value={dataFinal}
                                    onChange={handleDataFinalChange}
                                    autoComplete="data"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                </div>
                            </div>

                            <div className="sm:col-span-7">
                                <label htmlFor="local" className="block text-sm font-medium leading-6 text-gray-900">Local de Atendimento</label>
                                    <div className="mt-2">
                                    <input
                                        type="text"
                                        name="localAtendimento"
                                        id="localAtendimento"
                                        value={localAtendimento}
                                        onChange={(e) => setLocalAtendimento(e.target.value)}
                                        autoComplete="localAtendimento"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="uf-local" className="block text-sm font-medium leading-6 text-gray-900">UF</label>
                                <div className="mt-2">
                                    <select
                                    id="estadoAtendimento"
                                    name="estadoAtendimento"
                                    autoComplete="estadoAtendimento"
                                    onChange={(e) => setEstadoAtendimento(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>SP</option>
                                        <option>RJ</option>
                                        <option>ES</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="valorEmpresa" className="block text-sm font-medium leading-6 text-gray-900">Tipo Atendimento</label>
                                <div className="mt-2">
                                    <select
                                    id="assistencia"
                                    name="assistencia"
                                    autoComplete="assistencia"
                                    onChange={(e) => setAssistencia(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>Selecione um tipo</option>
                                        <option value="PLANTAO 6 Hrs">PLANTÃO 6 Hrs</option>
                                        <option value="PLANTAO 12 Hrs">PLANTÃO 12 Hrs</option>
                                        <option value="PLANTAO 8 Hrs">PLANTÃO 8 Hrs</option>
                                        <option value="AVALIACAO">AVALIAÇÃO</option>
                                        <option value="ADAPTACAO">ADAPTAÇÃO</option>
                                        <option value="PONTUAL TEC">PONTUAL TEC</option>
                                        <option value="PONTUAL ENF">PONTUAL ENF</option>
                                        <option value="SUPERVISAO">SUPERVISÃO</option>
                                        <option value="NUTRICIONISTA">NUTRICIONISTA</option>
                                        <option value="MEDICO">MÉDICO</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="uf-local" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                                <div className="mt-2">
                                    <select
                                    id="statusAtendimento"
                                    name="statusAtendimento"
                                    autoComplete="statusAtendimento"
                                    value={statusAtendimento}
                                    onChange={(e) => setStatusAtendimento(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>Selecione o Status</option>
                                        <option value="AGUARDANDO">AGUARDANDO</option>
                                        <option value="INICIADO">INICIADO</option>
                                        <option value="PAUSADO">PAUSADO</option>
                                        <option value="FINALIZADO">FINALIZADO</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="empresa" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
                                <div className="mt-2">
                                    <ComboBoxClientes onSelectCliente={handleSelectCliente} />
                                </div>
                            </div>
                            
                            <div className="col-span-5">
                                <label htmlFor="profissional" className="block text-sm font-medium leading-6 text-gray-900">Profissional</label>
                                <div className="mt-2">
                                    <BuscaEnfermeiro onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
                                </div>
                            </div>                            
                            
                            <div className="sm:col-span-2">
                                <label htmlFor="valorEmpresa" className="block text-sm font-medium leading-6 text-gray-900">Valor Empresa</label>
                                <div className="mt-2">
                                <input
                                    type="text"
                                    name="valorEmpresa"
                                    id="valorEmpresa"
                                    value={valorEmpresa}
                                    onChange={(e) => setValorEmpresa(e.target.value)}
                                    autoComplete="valorEmpresa"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="valorProfissional" className="block text-sm font-medium leading-6 text-gray-900">Valor Profissional</label>
                                <div className="mt-2">
                                <input
                                    type="text"
                                    name="valorProfissional"
                                    id="valorProfissional"
                                    value={valorProfissional}
                                    onChange={(e) => setValorProfissional(e.target.value)}
                                    autoComplete="valorProfissional"
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                </div>
                            </div>
                            <div className="sm:col-span-1 text-center">
                                <label htmlFor="pago" className="block text-sm font-medium leading-6 text-gray-900">Pago?</label>
                                <div className="mt-2">
                                    <input
                                    type="checkbox"
                                    checked={diaPago}
                                    onChange={handleCheckboxChange}
                                    name="diaPago"
                                    id="diaPago"
                                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:text-teal-600 justify-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div> 
                    <Botoes onCancel={handleCancel} onSubmit={handleSubmit} />   

                    {/* <div className="mt-6 flex items-center justify-end gap-x-2">
                        <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
                        <button type="submit" className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm">Salvar</button>
                    </div>  */}
                </div>
            </form>     
        </Page>
    )
}

export default Atendimentos;