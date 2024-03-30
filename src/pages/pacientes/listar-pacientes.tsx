import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import InputMask from "react-input-mask";

import { TbFilter, TbFilterX } from "react-icons/tb";
import Link from "next/link";
import { toast } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import BuscaPacienteFiltro from "@/components/BuscaPacienteFiltro";
import { CgSpinnerTwo } from "react-icons/cg";
import { useRouter } from "next/router";

interface FiltrosState {
  PacienteId: string;
  Cidade: string;
  Estado: string;
}

const initialState: FiltrosState = {
  PacienteId: '',
  Cidade: '',
  Estado: ''
};

export default function ListarPacientes() {
  const [isLoading, setIsLoading] = useState(true);
  const [pacientes, setPacientes]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pacienteId, setPacienteId] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [filtros, setFiltros] = useState<FiltrosState>(initialState);
  const itensPorPagina = 10;
  const router = useRouter();

  useEffect(()=>{
    setTimeout(() => {
      getPacientes(currentPage, 10)
    }, 2000);
  }, [currentPage]);

  useEffect(()=>{
    getQtdPacientes()
  }, []);

  async function getQtdPacientes(){
    const response = await api.get(`/api/Pacientes/qtdPacientes`)
    .then(response => {
      setTotalItems(response.data.totalItems);
      setTotalPaginas(Math.ceil(response.data.totalItems / itensPorPagina));
    }).catch(error => {
       toast.error('Erro ao obter o total de itens:', error)
    })
  };

  async function getPacientes(page: number, pageSize: number) {
    try {
      let queryString = `?page=${page}&pageSize=${pageSize}`;
      
      // Verifica se há algum filtro preenchido
      const filtrosPreenchidos = Object.values(filtros).some(value => !!value);
      
      // Se houver algum filtro preenchido, adiciona os filtros à queryString
      if (filtrosPreenchidos) {
        queryString += '&' + Object.entries(filtros).map(([key, value]) => `${key}=${value}`).join('&');
      }
      
      const response = await api.get(`/api/Pacientes/todos-pacientes${queryString}`);
      setPacientes(response.data.result);
    } catch (error: any) {
      toast.error("Erro ao carregar dados. " + error.message);
    }
  }

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idPaciente: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/Pacientes/${idPaciente}`);
      toast.success("Registro deletado com sucesso.");
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };

  const handleNextPrevPageChange = async (
    page: number,
    endpoint: string
  ) => {
      try {
        let queryString = `?page=${page}&pageSize=${itensPorPagina}`;
        // Verifica se há filtros preenchidos
        const filtrosPreenchidos = filtros && Object.values(filtros).some(value => !!value);

        // Se houver filtros preenchidos, constrói a queryString
        if (filtrosPreenchidos) {
          queryString += '&' + Object.entries(filtros).map(([key, value]) => `${key}=${value}`).join('&');
        }

        // Constrói a URL completa com endpoint e queryString
        const url = `/api/Pacientes/${endpoint}` + queryString;

        // Faz a requisição para a API
        const response = await api.get(url);
        const { data } = response;
        setPacientes(data.result);
        setCurrentPage(page);
      } catch (error) {
          toast.error('Erro ao chamar a API.');
      }
  };

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const endpoint = hasFiltros(filtros) ? 'filtro' : 'todos-pacientes';
    await handleNextPrevPageChange(nextPage, endpoint);
  };
  
  const hasFiltros = (filtros: FiltrosState): boolean => {
    return Object.values(filtros).some(value => !!value);
  };
    
  const handlePrevPage = async () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    const endpoint = hasFiltros(filtros) ? 'filtro' : 'todos-pacientes';
    await handleNextPrevPageChange(prevPage, endpoint);
  };
  
  // const handleNextPage = () => {
  //   setCurrentPage((prevPage) => prevPage + 1);
  // };

  // const handlePrevPage = () => {
  //   setCurrentPage((prevPage) => prevPage - 1);
  // };

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

    const handlePacienteSelecionado = (id: string | null) => {
    setPacienteId(id || '');
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      acienteId: id || '',
    }));
  
    console.log(id);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
     
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  const handleFilterSubmit = async (e: React.MouseEvent<HTMLButtonElement>, page: number, pageSize: number) => {
    e.preventDefault();
  
    try {
      let queryString = `?page=${page}&pageSize=${pageSize}`;
      
      const filtrosComCidadeEstado = {
        ...filtros,
        Cidade: cidade,
        Estado: estado
      };
      
      const filtrosPreenchidos = Object.values(filtrosComCidadeEstado).some(value => !!value);
      
      if (filtrosPreenchidos) {
        queryString = '?' + Object.entries(filtrosComCidadeEstado).map(([key, value]) => `${key}=${value}`).join('&');
      }
      
      const response = await api.get(`/api/Pacientes/filtro${queryString}&page=${page}&pageSize=${pageSize}`);
      const { results, totalCount, totalPages } = response.data;

      setPacientes(results);
      setCurrentPage(page);
      setTotalPaginas(totalPages);
      setTotalItems(totalCount);
    } catch (error: any) {
      toast.error("Erro ao carregar dados. " + error.message);
    }
  };

  const handleNovoPacienteClick = () => {
    setIsLoading(true);
    router.push('/pacientes/pacientes'); // ou qualquer rota que corresponda à página de cadastro
  };

  const resetarFiltros = async (e: React.MouseEvent<HTMLButtonElement>| null) => {

    if (e) {
      e.preventDefault();
    }

    const novosFiltros = {
      PacienteId: '',
      Cidade: '',
      Estado: ''
    };

    setFiltros(novosFiltros);
    setCurrentPage(1);

    try {
      let queryString = `?page=1&pageSize=10`;

      // Verifica se há filtros preenchidos
      const filtrosPreenchidos = Object.values(novosFiltros).some(value => !!value);

      // Se houver filtros preenchidos, constrói a queryString
      if (filtrosPreenchidos) {
        queryString = '?' + Object.entries(novosFiltros).map(([key, value]) => `${key}=${value}`).join('&');
      }

      // Faz a requisição para a API
      const response = await api.get(`/api/Pacientes/filtro${queryString}&page=1&pageSize=${itensPorPagina}`);
      const { results, totalCount, totalPages } = response.data;

      // Atualiza os estados com os dados recebidos
      setPacientes(results);
      setTotalPaginas(totalPages);
      setTotalItems(totalCount);
    } catch (error) {
      toast.error('Erro ao chamar a API.');
    }
  };
  
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
  //     </div>
  //   );
  // }
  
  return (
    <Page titulo="Listagem de Pacientes">
      <form className="container max-w-full">
        <Link href="">
          <button onClick={handleNovoPacienteClick} className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Paciente</button>    
        </Link>
        
        <div className="mt-6 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
              <div className="mt-2">
                <BuscaPacienteFiltro onPacienteSelecionado={handlePacienteSelecionado}/>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="cidade" className="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="cidade"
                  id="cidade"
                  autoComplete="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="estado" className="block text-sm font-medium leading-6 text-gray-900">UF</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="estado"
                  id="estado"
                  autoComplete="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8 sm:col-span-1 text-center">
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-6 rounded" onClick={(e) => handleFilterSubmit(e, currentPage, 10)}><TbFilter/></button>  
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-6 rounded" onClick={(e) => resetarFiltros(e)}><TbFilterX/></button> 
            </div>
          </div>
          <div className="mt-6 overflow-y-auto rounded-lg shadow hidden md:block">
            <table className="w-full">
              <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                <tr>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Nome</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Email</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Telefone</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">CEP</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Endereço</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Cidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pacientes && pacientes.map((paciente: any)=>(
                  <tr key={paciente.pacienteId}>
                    <td className="text-left w-80 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{paciente.nome}</td>
                    <td className="text-left w-80 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{paciente.email}</td>
                    <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                      <InputMask mask="(99) 9 9999-9999" value={paciente.telefone} readOnly />
                    </td>
                    <td className="text-left w-20 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                      <InputMask mask="99.999-999" value={paciente.cep} readOnly />
                    </td>
                    <td className="text-left w-96 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{paciente.endereco}, {paciente.numero}</td>
                    <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{paciente.cidade} - {paciente.estado}</td>
                    <td className="text-center w-40 pb-3 pr-3 border-r border-b border-gray-200">
                      <Link href={`/pacientes/editar/${paciente.pacienteId}`}>
                        <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><BiEdit /></button> { }
                      </Link> { }
                        <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded" onClick={(event) => handleDeleteClick(event, paciente.pacienteId)}><FaTrashAlt /></button>
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