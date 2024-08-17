import Page from "@/components/Page";
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import api from '../../api';
import Link from "next/link";
import {Slide, Flip, toast } from 'react-toastify';
import BuscaEnfermeiro from "@/components/BuscaEnfermeiro";
import BuscaPaciente from "@/components/BuscaPaciente";
import ComboBoxClientes from "@/components/ComboBoxClientes ";
import EditarAtendimento from './editar/[id]';
import { NumericFormat } from 'react-number-format';

interface AtendimentoProps {
    // Outras propriedades necessárias para o componente de Atendimento
  }

interface HorariosPropos {
    horarioId: string;
    descricao: string;
}  

const Atendimentos: React.FC<AtendimentoProps> = () => {
    const [clienteId, setClienteId] = useState<string>('');
    const [pacienteId, setPacienteId] = useState('');
    const [enfermeiroId, setEnfermeiroId] = useState('');
    const [dataAtendimento, setDataAtendimento] = useState<string>('');
    const [localAtendimento, setLocalAtendimento] = useState('');
    const [estadoAtendimento, setEstadoAtendimento] = useState('');
    const [assistencia, setAssistencia] = useState('');
    const [valorEmpresa, setValorEmpresa] = useState('');
    const [valorProfissional, setValorProfissional] = useState('');
    const [horarios, setHorarios] = useState<HorariosPropos[]>([]);
    const [horario, setHorario] = useState('');
    const [isValid, setIsValid] = useState(false);

    const router = useRouter();

    const isFormValid = () => {
        return (
            pacienteId !== '' &&
            enfermeiroId !== '' &&
            clienteId !== '' &&
            dataAtendimento !== '' &&
            localAtendimento !== '' &&
            estadoAtendimento !== '' &&
            assistencia !== '' &&
            horario !== '' &&
            valorEmpresa !== '' &&
            valorProfissional !== ''
        );
    };

    useEffect(() => {
        if (parseFloat(valorProfissional) > parseFloat(valorEmpresa)) {
            toast.warning('O valor profissional não pode ser maior que o valor da empresa.');
        }
      }, [valorEmpresa, valorProfissional]);

      useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await api.get('/api/Horarios/todos-horarios');
                setHorarios(response.data);
            } catch (error) {
                console.error("Erro ao carregar horários.", error);
                toast.error("Erro ao carregar horários.", {
                    transition: Slide,
                    icon: false
                });
            }
        };

        fetchHorarios();
    }, []);  

    useEffect(() => {
        setIsValid(isFormValid());
    }, [pacienteId, enfermeiroId, clienteId, dataAtendimento, localAtendimento, estadoAtendimento, assistencia, horario, valorEmpresa, valorProfissional]);

    const handleDataAtendimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataAtendimento(e.target.value);
    };
    
    const isValidDate = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
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
            dataAtendimento,
            localAtendimento,
            estadoAtendimento,
            assistencia,
            valorEmpresa,
            valorProfissional,
            horario
        };

        if (parseFloat(valorProfissional) >= parseFloat(valorEmpresa)) {
            toast.warning('Valor Profissional não pode ser maior ou igual que Valor Empresa.');
            return; 

            setValorEmpresa('');
            setValorProfissional('');
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

                            <div className="sm:col-span-2">
                                <label htmlFor="dataAtendimento" className="block text-sm font-medium leading-6 text-gray-900">
                                    Data Atendimento
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        name="dataAtendimento"
                                        id="dataAtendimento"
                                        value={dataAtendimento}
                                        onChange={handleDataAtendimentoChange}
                                        autoComplete="data-atendimento"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="horarioId" className="block text-sm font-medium leading-6 text-gray-900">Horário</label>
                                <div className="mt-2">
                                    <select
                                        id="horarioId"
                                        name="horarioId"
                                        onChange={(e) => setHorario(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                        {horarios.map((horario) => (
                                            <option key={horario.horarioId} value={horario.descricao}>{horario.descricao}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
                                <div className="mt-2">
                                    <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
                                </div>
                            </div>
                           
                            <div className="sm:col-span-3">
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
                                        <option>AC</option>
                                        <option>AL</option>
                                        <option>AP</option>
                                        <option>AM</option>
                                        <option>BA</option>
                                        <option>CE</option>
                                        <option>DF</option>
                                        <option>ES</option>
                                        <option>GO</option>
                                        <option>MA</option>
                                        <option>MT</option>
                                        <option>MS</option>
                                        <option>MG</option>
                                        <option>PA</option>
                                        <option>PB</option>
                                        <option>PR</option>
                                        <option>PE</option>
                                        <option>PI</option>
                                        <option>RJ</option>
                                        <option>RN</option>
                                        <option>RS</option>
                                        <option>RO</option>
                                        <option>RR</option>
                                        <option>SC</option>
                                        <option>SP</option>
                                        <option>SE</option>
                                        <option>TO</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <label htmlFor="profissional" className="block text-sm font-medium leading-6 text-gray-900">Profissional</label>
                                <div className="mt-2">
                                    <BuscaEnfermeiro onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
                                </div>
                            </div> 

                            <div className="sm:col-span-2">
                                <label htmlFor="valorEmpresa" className="block text-sm font-medium leading-6 text-gray-900">Assistência</label>
                                <div className="mt-2">
                                    <select
                                    id="assistencia"
                                    name="assistencia"
                                    autoComplete="assistencia"
                                    onChange={(e) => setAssistencia(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>Selecione um tipo</option>
                                        <option value="ADAPTACAO">ADAPTAÇÃO</option>
                                        <option value="AVALIACAO">AVALIAÇÃO</option>
                                        <option value="PLANTAO 6 Hrs">PLANTÃO 6 Hrs</option>
                                        <option value="PLANTAO 8 Hrs">PLANTÃO 8 Hrs</option>
                                        <option value="PLANTAO 12 Hrs">PLANTÃO 12 Hrs</option>
                                        <option value="PONTUAL TEC">PONTUAL TEC</option>
                                        <option value="PONTUAL ENF">PONTUAL ENF</option>
                                        <option value="SUPERVISAO">SUPERVISÃO</option>
                                        <option value="NUTRICIONISTA">NUTRICIONISTA</option>
                                        <option value="MEDICO">MÉDICO</option>
                                        <option value="MEDICO">COBRANÇA RETROATIVA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="empresa" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
                                <div className="mt-2">
                                    <ComboBoxClientes onSelectCliente={handleSelectCliente} />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="valorEmpresa" className="block text-sm font-medium leading-6 text-gray-900">Valor Empresa</label>
                                <div className="mt-2">
                                <NumericFormat
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'R$ '}
                                    value={valorEmpresa}
                                    onValueChange={(values) => {
                                    const { formattedValue, value } = values;
                                    setValorEmpresa(value);
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="valorProfissional" className="block text-sm font-medium leading-6 text-gray-900">Valor Profissional</label>
                                <div className="mt-2">
                                    <NumericFormat
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'R$ '}
                                        value={valorProfissional}
                                        onValueChange={(values) => {
                                            const { formattedValue, value } = values;
                                            setValorProfissional(value);
                                        }}
                                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>               
                        
                        </div>
                    </div> 
                    {/* <Botoes onCancel={handleCancel} onSubmit={handleSubmit} />    */}

                    <div className="mt-6 flex items-center justify-end gap-x-2">
                        <button type="button" onClick={handleCancel} className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md">Cancelar</button>
                        <button type="submit" className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm" disabled={!isValid}>Salvar</button>
                    </div> 
                </div>
            </form>     
        </Page>
    )
}

export default Atendimentos;