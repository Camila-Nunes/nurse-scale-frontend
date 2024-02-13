import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import InputMask from "react-input-mask";
import { useRouter } from 'next/router';
import { TbFilter, TbFilterX } from "react-icons/tb";
import Link from "next/link";
import { toast } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import BuscaEnfermeiroFiltro from "@/components/BuscaEnfermeiroFiltro";
import { CgSpinnerTwo } from "react-icons/cg";

interface FiltrosState {
  enfermeiroId: string;
  cidade: string;
  uf: string;
}

const initialState: FiltrosState = {
  enfermeiroId: '',
  cidade: '',
  uf: ''
};

export default function ListarEnfermeiros() {
  const router = useRouter();
  const [enfermeiros, setEnfermeiros] = useState([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [enfermeiroId, setEnfermeiroId] = useState('');
  const [filtros, setFiltros] = useState<FiltrosState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const itensPorPagina = 10;

  useEffect(() => {
    // Simulando um atraso de 2 segundos para carregar os dados
    setTimeout(() => {
      getEnfermeiros(currentPage, 10)
    }, 2000);
  }, [currentPage]);

  useEffect(()=>{
    getQtdEnfermeiros()
  }, []);

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

  async function getQtdEnfermeiros(){
    const response = await api.get(`/api/Enfermeiros/qtdEnfermeiros`)
    .then(response => {
      setTotalItems(response.data.totalItems);
      setTotalPaginas(Math.ceil(response.data.totalItems / itensPorPagina));
    }).catch(error => {
       toast.error('Erro ao obter o total de itens:', error)
    })
  };

  async function getEnfermeiros(page: number, pageSize: number){
    try {
      const response = await api.get(`/api/Enfermeiros?page=${page}&pageSize=${pageSize}`)
      setEnfermeiros(response.data.result);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
      setIsLoading(false); // Marca o carregamento como concluído, independentemente do resultado
    }
  };

  async function handleEditClick (id: string){
    setSelectedId(id); 
    console.log(id);
    router.push(`/enfermeiros/editar/${id}`);
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, id: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/Enfermeiros/${id}`);
      toast.success("Registro deletado com sucesso.");
      // if (response.status === 200) {
      //   setEnfermeiros(prevEnfermeiros => prevEnfermeiros.filter(e => e.enfermeiroId !== id));
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

  const handleEnfermeiroSelecionado = (id: string) => {
    const novoId = id.trim(); // Remova espaços em branco antes de verificar se está vazio
  
    setEnfermeiroId(novoId);
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      enfermeiroId: novoId,
    }));
  
    console.log(novoId);
  };

  const handleFilterSubmit = async (e: React.MouseEvent<HTMLButtonElement> | null) => {
    if (e) {
      e.preventDefault();
    }
  
    if (!Object.values(filtros).some(value => !!value)) {
      toast.info('Não existe valor para ser filtrado.');
      return;
    }
  
    try {
      const response = await api.post('/api/Enfermeiros/filtro', filtros);
      setEnfermeiros(response.data.result);
      console.log(response.data.result);
      console.log(filtros);
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
    }
  };

  const resetarFiltros = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFiltros(initialState);
    getEnfermeiros(currentPage, 10);
    setEnfermeiroId('');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  }

  const handleNovoEnfermeiroClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Aqui você pode realizar qualquer lógica adicional antes de redirecionar para a página de cadastro
      router.push('/enfermeiros/enfermeiros'); // ou qualquer rota que corresponda à página de cadastro
    }, 2000);
  };

  return (
    <Page titulo="Listagem de Enfermeiros">
      <form className="container max-w-full">
        {/* <Link href="/enfermeiros/enfermeiros"> 
          <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white">Novo Enfermeiro</button>  
        </Link> */}
        <Link href="">
          <button onClick={handleNovoEnfermeiroClick} className="rounded-md bg-teal-600 hover:bg-teal-800 px-3 py-2 text-sm font-semibold leading-6 text-white" disabled={isLoading}>
            {isLoading ? (
              <CgSpinnerTwo className="animate-spin text-white" size={20} />
            ) : (
              'Novo Enfermeiro'
            )}
          </button>    
        </Link>
        <div className="mt-2 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
              <div className="mt-2">
                <BuscaEnfermeiroFiltro onEnfermeiroSelecionado={handleEnfermeiroSelecionado} />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="atendimento"
                  id="atendimento"
                  autoComplete="given-name"
                  value={filtros.cidade}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">UF</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="atendimento"
                  id="atendimento"
                  autoComplete="given-name"
                  value={filtros.uf}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8 sm:col-span-1 text-center">
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-3 rounded" onClick={handleFilterSubmit}><TbFilter/></button>  
              <button className="flex items-center justify-between bg-gray-700 hover:bg-gray-500 hover:text-white text-white text-lg font-semibold py-1 px-3 rounded" onClick={resetarFiltros}><TbFilterX/></button> 
            </div>
          </div>
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full">
              <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                <tr>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Nome</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Email</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Telefone</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Cidade</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Tipo Chave</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Chave Pix</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enfermeiros && enfermeiros.map((enfermeiro: any)=>(
                  <tr key={enfermeiro.enfermeiroId}>
                    <td className="text-left w-64 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b">{enfermeiro.nome}</td>
                    <td className="text-left w-64 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b">{enfermeiro.email}</td>
                    <td className="text-left w-32 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b">
                      <InputMask mask="(99) 9 9999-9999" value={enfermeiro.telefone} readOnly />
                    </td>
                    <td className="text-left w-64 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b">{enfermeiro.cidade}-{enfermeiro.estado}</td>
                    <td className="text-left w-32 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b">{enfermeiro.tipoChavePix}</td>
                    <td className="text-left w-32 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b">{enfermeiro.chavePix}</td>
                    <td className="text-center w-28 pb-3 pr-3 border-r border-b">
                      <Link href={`/enfermeiros/editar/${enfermeiro.enfermeiroId}`}>
                        <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><BiEdit /></button> { }
                      </Link> { }
                        <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded" onClick={(event) => handleDeleteClick(event, enfermeiro.enfermeiroId)}><FaTrashAlt /></button>
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