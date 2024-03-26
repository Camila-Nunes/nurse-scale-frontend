import Page from "@/components/Page";
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from 'date-fns';
import api from '../../api';
import Link from "next/link";
import { FaTrashAlt, FaSpinner } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { TbFilter, TbFilterX } from "react-icons/tb";
import {Slide, Flip, toast } from 'react-toastify';
import BuscaEnfermeiroFiltro from "@/components/BuscaEnfermeiroFiltro";
import ComboBoxClientes from "@/components/ComboBoxClientes ";
import MonthFilter from "@/components/MonthFilter";
import Pagination from "@/components/Pagination";
import BuscaPacienteFiltro from "@/components/BuscaPacienteFiltro";
import FiltroMes from "@/components/FiltroMes";
import { GetStaticProps } from 'next';

interface ListarAtendimentosProps {
  meses: string[];
}

interface FiltrosState {
  Data: string;
  Atendimento: number;
  Empresa: string;
  Paciente: string;
  Enfermeiro: string;
  StatusAtendimento: string;
  DiaPago: string;
}

const initialState: FiltrosState = {
  Data: '',
  Atendimento: 0,
  Empresa: '',
  Paciente: '',
  Enfermeiro: '',
  StatusAtendimento: '',
  DiaPago: '',
};

const ListarAtendimentos: React.FC<ListarAtendimentosProps> = ({ meses }) => {
  const [clienteId, setClienteId] = useState<string>('');
  const [atendimentos, setAtendimentos]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [enfermeiroId, setEnfermeiroId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<FiltrosState>(initialState);
  const [limparCampos, setLimparCampos] = useState<boolean>(false);
  const [valorInicial, setValorInicial] = useState<string>('');

  const [Data, setData] = useState<string>('');
  const [Atendimento, setAtendimento] = useState(0);
  const [Empresa, setEmpresa] = useState<string>('');
  const [Paciente,setPaciente] = useState<string>('');
  const [Enfermeiro, setEnfermeiro] = useState<string>('');
  const [StatusAtendimento, setStatusAtendimento] = useState<string>('');
  const [DiaPago, setDiaPago] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM'));

  const handleAtendimentosSubmit = async (selectedMonth: string, monthIndex: number) => {
    setSelectedMonth(selectedMonth);
    //loadAtendimentosData(monthIndex);
  };

  // const loadAtendimentosData = async (monthIndex: number) => {
  //   try {
  //     await Promise.all([
  //       getAtendimentos()  
  //     ]);
  //   } catch (error) {
  //     toast.error('Erro ao carregar o dashboard.');
  //   }
  // };

  const getMonthNumber = (monthName: string) => {
    const monthIndex = meses.indexOf(monthName);
    return monthIndex + 1;
  };

  async function getQtdAtendimentos(){
    const response = await api.get(`/api/Atendimentos/qtdAtendimentos`)
    .then(response => {
      setTotalItems(response.data.totalItems);
      setTotalPaginas(Math.ceil(response.data.totalItems / itensPorPagina));
    }).catch(error => {
       toast.error('Erro ao obter o total de itens:', error)
    })
  };

  useEffect(()=>{
    getAtendimentos(currentPage, 10);
    const currentMonthIndex = getMonthNumber(selectedMonth);
    //loadAtendimentosData(currentMonthIndex);
  }, []);

  useEffect(()=>{
    getQtdAtendimentos()
  }, []);

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

  async function getAtendimentos(page: number, pageSize: number){
    const response = await api.get(`/api/Atendimentos/todos-atendimentos?page=${page}&pageSize=${pageSize}`)
    .then(response => {
      setAtendimentos(response.data.result);
    }).catch(error => {
       toast.error("Erro ao carregar dados. " + error)
    })
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idAtendimentos: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/Atendimentos/${idAtendimentos}`)
      toast.success("Registro deletado com sucesso.");
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };

  const handleNextPrevPageChange = async (page: number) => {
    try {
      const response = await api.post(`/api/Atendimentos/filtro`, {
        FiltroAtendimentoModel: filtros, // Certifique-se de que filtros esteja no formato esperado pelo modelo
        PaginationParameters: {
          page: page,
          pageSize: itensPorPagina
        }
      });
      const { data } = response;
      setAtendimentos(data.results); // Define os dados filtrados da página
      setCurrentPage(page); // Atualiza o estado da página atual
    } catch (error) {
      toast.error('Erro ao chamar a API.');
    }
  };
  
  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    await handleNextPrevPageChange(nextPage);
  };
  
  const handlePrevPage = async () => {
    const prevPage = currentPage - 1;
    await handleNextPrevPageChange(prevPage);
  };
  

  const handleEnfermeiroSelecionado = (id: string) => {
    const novoId = id.trim();
  
    setEnfermeiroId(novoId);
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      enfermeiro: novoId,
    }));
  
    console.log(novoId);
  };

  const handlePacienteSelecionado = (id: string | null) => {
    setPacienteId(id || '');
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      paciente: id || '',
    }));
  
    console.log(id);
  };

  const handleSelectCliente = (selectedClienteId: string, nomeFantasia: string) => {
    setClienteId(selectedClienteId);
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      Empresa: selectedClienteId,
    }));
  
    console.log(selectedClienteId);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (value !== 'Pago?' && value !== 'Selecione um Status') {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        [name]: value,
      }));
    } else {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        [name]: null,
      }));
    }
  };
  
  const handleFilterSubmit = async (e: React.MouseEvent<HTMLButtonElement> | null, page: number, pageSize: number) => {
    if (e) {
      e.preventDefault();
    }
  
    if (!Object.values(filtros).some(value => !!value)) {
      toast.info('Não existe valor para ser filtrado.');
      return;
    }
  
    try {
      // Fazendo as duas chamadas concorrentemente
      const filteredResponse = await api.post(`/api/Atendimentos/filtro`, {
        FiltroAtendimentoModel: filtros, // Certifique-se de que filtros esteja no formato esperado pelo modelo
        PaginationParameters: {
          page: page,
          pageSize: pageSize
        }
      });
      // Extrai os dados de cada resposta
      const { results, totalCount, totalPages } = filteredResponse.data;
  
      // Atualiza os estados com os dados recebidos
      setAtendimentos(results);
      setCurrentPage(page);
      setTotalItems(totalCount);
      setTotalPaginas(totalPages);
    } catch (error: any) {
      toast.error('Erro ao chamar a API.' + error.message);
    }
  };
  
  const resetarFiltros = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  
    setData('');
    setAtendimento(0);
    setEmpresa('');
    setPaciente('');
    setEnfermeiro('');
    setStatusAtendimento('');
    setDiaPago('');
  
    const novosFiltros = {
      Data: '',
      Atendimento: 0,
      Empresa: '',
      Paciente: '',
      Enfermeiro: '',
      StatusAtendimento: '',
      DiaPago: ''
    };
  
    setFiltros(novosFiltros);
    setCurrentPage(1);
    
    try {
      const response = await api.post(`/api/Atendimentos/filtro`, {
        FiltroAtendimentoModel: novosFiltros, // Certifique-se de que novosFiltros esteja no formato esperado pelo modelo
        PaginationParameters: {
          page: 1,
          pageSize: 10 // Ajuste conforme necessário
        }
      });
  
      const { results, totalCount, totalPages } = response.data;
      setAtendimentos(results); // Define os dados filtrados da página
      setTotalPaginas(totalPages);
      setLimparCampos(true);
    } catch (error) {
      toast.error('Erro ao chamar a API.');
    }
  };

  return (
    <Page titulo="Atendimentos">
      <form className="container max-w-full">
        <Link href="/atendimentos/atendimentos">
          <button type="button" className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Atendimento</button>     
        </Link>
        <div className="mt-2 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-12">           
            <FiltroMes meses={meses} onChange={handleAtendimentosSubmit} />
            <div className="sm:col-span-2">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
              <div className="mt-2">
                <ComboBoxClientes onSelectCliente={handleSelectCliente} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
              <div className="mt-2">
                <BuscaPacienteFiltro 
                  onPacienteSelecionado={handlePacienteSelecionado} 
                  valorInicial={limparCampos ? '' : valorInicial} // Use limparCampos para definir o valor inicial
                  limparFiltros={limparCampos} // Passe limparCampos como prop limparFiltros
                />
              </div>  
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Enfermeiro</label>
              <div className="mt-2">
                <BuscaEnfermeiroFiltro onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="statusAtendimento" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
              <div className="mt-2">
                <select
                    id="statusAtendimento"
                    name="statusAtendimento"
                    value={StatusAtendimento}
                    onChange={handleFilterChange}
                    autoComplete="statusAtendimento"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Status</option>
                    <option value="AGUARDANDO">AGUARDANDO</option>
                    <option value="INICIADO">INICIADO</option>
                    <option value="PAUSADO">PAUSADO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="DiaPago" className="block text-sm font-medium leading-6 text-gray-900">Pago?</label>
              <div className="mt-2">
                <select
                    id="DiaPago"
                    name="DiaPago"
                    value={DiaPago}
                    onChange={handleFilterChange}
                    autoComplete="DiaPago"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Pago?</option>
                    <option value={0}>NÃO</option>
                    <option value={1}>SIM</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8 sm:col-span-1 text-center">
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-6 rounded" onClick={(e) => handleFilterSubmit(e, currentPage, itensPorPagina)}><TbFilter/></button>  
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-6 rounded" onClick={resetarFiltros}><TbFilterX/></button> 
            </div>
          </div>
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full border border-collapse">
            <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600 border-r">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Paciente</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Enfermeiro</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Data</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Status</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Local</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Assistência</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Vr. Empresa</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Vr. Profissional</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left text-center border-r">Pago?</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {atendimentos && atendimentos.map((atendimento: any) => (
                <tr key={atendimento.atendimentoId} className="border-b border-gray-200">
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.nomeFantasia}</td>
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.paciente}</td>
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.enfermeiro}</td>
                  <td className="text-left w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.dataInicial}</td>
                  <td className="text-center w-36 p-3 text-sm whitespace-nowrap border-r border-b">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${atendimento.statusAtendimento === 'AGUARDANDO' ? 'bg-gray-300' : 
                                                                                    atendimento.statusAtendimento === 'INICIADO' ? 'bg-blue-200' : 
                                                                                    atendimento.statusAtendimento === 'PAUSADO' ? 'bg-red-200' : 
                                                                                    atendimento.statusAtendimento === 'FINALIZADO' ? 'bg-green-400' : 'bg-gray-300'}`}>
                      {atendimento.statusAtendimento}
                    </span>
                  </td>


                  <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.localAtendimento}  - {atendimento.estadoAtendimento}</td>
                  <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.assistencia}</td>
                  <td className="text-right w-40 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                    R$ {isNaN(parseFloat(atendimento.valorEmpresa)) ? 'Valor inválido' : parseFloat(atendimento.valorEmpresa).toFixed(2)}
                  </td>
                  <td className="text-right w-40 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                    R$ {isNaN(parseFloat(atendimento.valorProfissional)) ? 'Valor inválido' : parseFloat(atendimento.valorProfissional).toFixed(2)}
                  </td>
                  <td className="text-center w-28 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.diaPago}</td>
                  <td className="text-center w-36 pb-3 pr-3 border-r border-b border-gray-200">
                    <Link href={`/atendimentos/editar/${atendimento.atendimentoId}`}>
                      <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><BiEdit /></button> { }
                    </Link> { }
                    <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded" onClick={(event) => handleDeleteClick(event, atendimento.atendimentoId)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPaginas}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onPageChange={handlePageChange}
          />
          </div>
        </div>
      </form>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<ListarAtendimentosProps> = async () => {
  // Gere os meses dinamicamente ou carregue de uma API
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return {
    props: {
      meses,
    },
  };
};

export default ListarAtendimentos;