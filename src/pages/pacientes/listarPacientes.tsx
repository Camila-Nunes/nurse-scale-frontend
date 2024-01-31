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

interface FiltrosState {
  pacienteId: string;
}

const initialState: FiltrosState = {
  pacienteId: ''
};

export default function Pacientes() {

  const [pacientes, setPacientes]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pacienteId, setPacienteId] = useState('');
  const [filtros, setFiltros] = useState<FiltrosState>(initialState);
  const itensPorPagina = 10;

  useEffect(()=>{
    getPacientes(currentPage, 10)
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

  async function getPacientes(page: number, pageSize: number){
    const response = await api.get(`/api/Pacientes?page=${page}&pageSize=${pageSize}`)
    .then(response => {
      setPacientes(response.data.result);
    }).catch(error => {
      toast.error("Erro ao carregar dados. " + error)
    })
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idPaciente: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/Pacientes/${idPaciente}`);
      toast.success("Registro deletado com sucesso.");
      // if (response.status === 200) {
      //   setPacientes(prevPacientes => prevPacientes.filter(p => p.pacienteId !== idPaciente));
      //   toast.success("Registro deletado com sucesso.");
      // } else {
      //   toast.error("Erro ao deletar registro.");
      // }
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };
  
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

    const handlePacienteSelecionado = (id: string | null) => {
    setPacienteId(id || '');
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      pacienteId: id || '',
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
  
    if (!Object.values(filtros).some(value => !!value)) {
      toast.info('Não existe valor para ser filtrado.');
      return;
    }
  
    try {
      const response = await api.get(`api/Pacientes/filtro`, {
        params: {
          page: page,
          pageSize: pageSize,
          ...filtros,
        },
      });
  
      console.log(response);
      setPacientes(response.data.result);
      setCurrentPage(page);
      console.log(response.data.result);
      console.log(filtros);
    } catch (error) {
      toast.error(`Erro ao chamar a API.`);
    }
  };
  
  
  return (
    <Page titulo="Listagem de Pacientes">
      <form className="container max-w-full">
        <Link href="/pacientes/pacientes">
          <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Paciente</button>     
        </Link>
        
        <div className="mt-6 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-12">
            <div className="sm:col-span-11">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
              <div className="mt-2">
                <BuscaPacienteFiltro onPacienteSelecionado={handlePacienteSelecionado} limparFiltros={true} />
              </div>
            </div>
            <div className="flex gap-3 mt-8 sm:col-span-1 text-center">
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-3 rounded" onClick={(e) => handleFilterSubmit(e, currentPage, 10)}><TbFilter/></button>  
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-3 rounded"><TbFilterX/></button> 
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