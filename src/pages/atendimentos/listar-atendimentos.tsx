import Page from "@/components/Page";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import api from '../../api';
import Link from "next/link";
import { FaTrashAlt, FaSpinner } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { toast } from 'react-toastify';
import BuscaEnfermeiroFiltro from "@/components/BuscaEnfermeiroFiltro";
import ComboBoxClientes from "@/components/ComboBoxClientes ";
import Pagination from "@/components/Pagination";
import BuscaPacienteFiltro from "@/components/BuscaPacienteFiltro";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { GetStaticProps } from 'next';
import { pt } from 'date-fns/locale';
import { CgSpinnerTwo } from "react-icons/cg";
import FiltroDia from "@/components/FiltroDia";
import FiltroData from "@/components/SelectDate";
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
}

const initialState: FiltrosState = {
  Data: '',
  Atendimento: 0,
  Empresa: '',
  Paciente: '',
  Enfermeiro: '',
  StatusAtendimento: ''
};

interface PaginationParameters {
  page: number;
  pageSize: number;
}

interface AtendimentoRequest {
  paginationParameters: PaginationParameters;
  mes: number;
  ano: number;
}

interface Atendimento {
  atendimentoId: string;
  isChecked: boolean;
  Data: string,
  Atendimento: number,
  Empresa: string,
  Paciente: string,
  Enfermeiro: string,
  StatusAtendimento: string,
  DiaPago: string
}

const ListarAtendimentos: React.FC<ListarAtendimentosProps> = ({ meses }) => {
  const [clienteId, setClienteId] = useState<string>('');
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
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
  const [indexMonth, setIndexMonth] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);

  const fullMonthName = format(new Date(), 'MMMM', { locale: pt });
  const monthName = fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  async function getAtendimentos(page: number, pageSize: number, mes: number, ano: number, dia: number) {
    try {
      let queryString = `?page=${page}&pageSize=${pageSize}&mes=${mes}&ano=${ano}&dia=${dia}`;
      const filtrosPreenchidos = Object.values(filtros).some(value => !!value);

      if (filtrosPreenchidos) {
        queryString += '&' + Object.entries(filtros).map(([key, value]) => `${key}=${value}`).join('&');
      }
      
      const response = await api.get(`/api/Atendimentos/todos-atendimentos${queryString}`);
      const { results, totalCount, totalPages } = response.data;
      return { results, totalCount, totalPages }; 
    } catch (error: any) {
      toast.error("Erro ao carregar dados. " + error.message);
      return { results: [], totalCount: 0, totalPages: 0 }; 
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = hasFiltros(filtros) ? 'filtro' : 'todos-atendimentos';
        const data = await handleNextPrevPageChange(currentPage, endpoint, selectedMonth, selectedYear, selectedDay);
          setAtendimentos(data.results); // Atualizar o estado com os resultados
          setTotalItems(data.totalCount); // Atualizar o estado com o número total de itens
          setTotalPaginas(data.totalPages); // Atualizar o estado com o número total de páginas
      } catch (error) {
        // Trate os erros aqui, se necessário
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedMonth, selectedYear, selectedDay, currentPage, itensPorPagina, filtros]);
  
  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idAtendimentos: string) {
    event.preventDefault();
    try {
      const currentYear = new Date().getFullYear();
      const response = await api.delete(`/api/Atendimentos/${idAtendimentos}`)
      toast.success("Registro deletado com sucesso.");
      getAtendimentos(currentPage, 10, selectedMonth, currentYear, selectedDay);
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };

  interface AtendimentoRequest {
    paginationParameters: PaginationParameters;
    mes?: number;
    ano?: number;
    FiltroAtendimentoModel?: any;
  }
  
  const handleNextPrevPageChange = async (
    page: number,
    endpoint: string,
    mes?: number,
    ano?: number,
    dia?: number
  ) => {
    try {
      let queryString = `?page=${page}&pageSize=${itensPorPagina}&mes=${mes}&ano=${ano}&dia=${dia}`;
      const filtrosPreenchidos = filtros && Object.values(filtros).some(value => !!value);
  
      if (filtrosPreenchidos) {
        queryString += '&' + Object.entries(filtros).map(([key, value]) => `${key}=${value}`).join('&');
      }
  
      const url = `/api/Atendimentos/${endpoint}` + queryString;
      const response = await api.get(url);
      const { data } = response;
      return data;
    } catch (error) {
      toast.error('Erro ao chamar a API.');
      return { results: [], totalCount: 0, totalPages: 0 }; // Tratar o erro corretamente
    }
  };

  const hasFiltros = (filtros: FiltrosState): boolean => {
    return Object.values(filtros).some(value => !!value);
  };

  const handleDateChange = (date: { dia: number; mes: number; ano: number }) => {
    console.log(`Dia: ${date.dia}, Mês: ${date.mes}, Ano: ${date.ano}`);
    setSelectedDay(date.dia);
    setSelectedMonth(date.mes);
    setSelectedYear(date.ano);
    console.log(`Dia: ${date.dia}, Mês: ${date.mes}, Ano: ${date.ano}`);
  };

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const endpoint = hasFiltros(filtros) ? 'filtro' : 'todos-atendimentos';
    const data = await handleNextPrevPageChange(nextPage, endpoint, selectedMonth, selectedYear, selectedDay);
    setAtendimentos(data.results);
    setTotalItems(data.totalCount);
    setTotalPaginas(data.totalPages);
  };
  
  const handlePrevPage = async () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    const endpoint = hasFiltros(filtros) ? 'filtro' : 'todos-atendimentos';
    const data = await handleNextPrevPageChange(prevPage, endpoint, selectedMonth, selectedYear, selectedDay);
    setAtendimentos(data.results);
    setTotalItems(data.totalCount);
    setTotalPaginas(data.totalPages);
  };
  
  const handleEnfermeiroSelecionado = (id: string) => {
    const novoId = id.trim();
  
    setEnfermeiroId(novoId);
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      Enfermeiro: novoId,
    }));
  
    console.log(novoId);
  };

  const handlePacienteSelecionado = (id: string | null) => {
    setPacienteId(id || '');
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      Paciente: id || '',
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
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (value !== 'Selecione um Status') {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        [name]: value,
      }));
    } else {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        [name]: '', // Alteração aqui para uma string vazia
      }));
    }
  };
  
  const handleFilterSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
    pageSize: number,
    mes: number,
    ano: number,
    dia: number
) => {
    if (e) {
        e.preventDefault();
    }

    try {
      let queryString = `?page=${page}&pageSize=${itensPorPagina}&mes=${mes}&ano=${ano}&dia=${dia}`;
      const filtrosPreenchidos = Object.values(filtros).some(value => !!value);

      if (filtrosPreenchidos) {
        queryString += '&' + Object.entries(filtros).map(([key, value]) => `${key}=${value}`).join('&');
      }

      const response = await api.get(`/api/Atendimentos/filtro${queryString}&page=${page}&pageSize=${pageSize}&mes=${mes}&ano=${ano}&dia=${dia}`);
      const { results, totalCount, totalPages } = response.data;

      setAtendimentos(results);
      setCurrentPage(page);
      setTotalItems(totalCount);
      setTotalPaginas(totalPages);
    } catch (error: any) {
        toast.error('Erro ao chamar a API.' + error.message);
    }
  };

  const resetarFiltros = async (e: React.MouseEvent<HTMLButtonElement>| null,
    mes: number,
    ano: number,
    dia: number
    
    ) => {

      if (e) {
        e.preventDefault();
    }

    setData('');
    setAtendimento(0);
    setEmpresa('');
    setPaciente('');
    setEnfermeiro('');
    setStatusAtendimento('');
    
    const novosFiltros = {
        Data: '',
        Atendimento: 0,
        Empresa: '',
        Paciente: '',
        Enfermeiro: '',
        StatusAtendimento: ''
    };

    setFiltros(novosFiltros);
    setCurrentPage(1);

    try {
      let queryString = `?page=1&pageSize=10&mes=${mes}&ano=${ano}&dia=${dia}`;
      const filtrosPreenchidos = Object.values(novosFiltros).some(value => !!value);

      if (filtrosPreenchidos) {
          queryString = '?' + Object.entries(novosFiltros).map(([key, value]) => `${key}=${value}`).join('&');
      }

      const response = await api.get(`/api/Atendimentos/filtro${queryString}&page=1&pageSize=${itensPorPagina}`);
      const { results, totalCount, totalPages } = response.data;

      setAtendimentos(results);
      setTotalPaginas(totalPages);
      setTotalItems(totalCount);
      setLimparCampos(true);
      setClienteId('-1');
    } catch (error) {
        toast.error('Erro ao chamar a API.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  }

  return (
    <Page titulo="Atendimentos">
      <form className="container max-w-full">
        <Link href="/atendimentos/atendimentos">
          <button type="button" className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Atendimento</button>     
        </Link>
        <div className="mt-2 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12"> 
            <div className="sm:col-span-1">
              <FiltroData onDateChange={handleDateChange} />
            </div> 

            <div className="sm:col-span-2">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
              <div className="mt-2">
                <ComboBoxClientes onSelectCliente={handleSelectCliente} />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
              <div className="mt-2">
                <BuscaPacienteFiltro 
                  onPacienteSelecionado={handlePacienteSelecionado} 
                  valorInicial={limparCampos ? '' : valorInicial}
                />
              </div>  
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Enfermeiro</label>
              <div className="mt-2">
                <BuscaEnfermeiroFiltro onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
              </div>
            </div>
            <div className="mt-6 sm:col-span-1 text-center">
              {/* <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-6 rounded" onClick={(e) => handleFilterSubmit(e, currentPage, itensPorPagina, indexMonth, selectedYear)}><TbFilter/></button>   */}
              <button className="flex gap-2 items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-base font-semibold mt-1.5 py-2 px-6 rounded" onClick={(e) => resetarFiltros(e, indexMonth, selectedYear, selectedDay)}>Limpar Filtros</button> 
            </div>
          </div>
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full border border-collapse">
            <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600 border-r">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Atendimento</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Horario</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Paciente</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Enfermeiro</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Data</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Assistência</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Local</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {atendimentos && atendimentos.map((atendimento: any) => (
                <tr key={atendimento.atendimentoId} className="border-b border-gray-200">
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.numeroAtendimento}</td>
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.horario}</td>
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.nomeFantasia}</td>
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.paciente}</td>
                  <td className="text-left w-48 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.enfermeiro}</td>
                  <td className="text-left w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.dataAtendimento}</td>
                  <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.assistencia}</td>
                  <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{atendimento.localAtendimento}  - {atendimento.estadoAtendimento}</td>
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
            totalRecords={totalItems}
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
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return {
    props: {
      meses,
    },
  };
};

export default ListarAtendimentos;