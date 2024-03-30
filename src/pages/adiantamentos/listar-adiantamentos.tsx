import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import { toast } from "react-toastify";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import { format } from "date-fns";
import { GetStaticProps } from "next";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { CgSpinnerTwo } from "react-icons/cg";

interface ListarAdiantamentosProps {
  meses: string[];
}

const ListarAdiantamentos: React.FC<ListarAdiantamentosProps> = ({ meses }) => {
  const [adiantamentos, setAdiantamentos]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const itensPorPagina = 10;
  const paginaAtual = Math.ceil((totalItems + 1)/itensPorPagina);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), 'MMMM')
  );

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const getMonthNumber = (monthName: string) => {
    const monthIndex = meses.indexOf(monthName);
    return monthIndex + 1;
  };

  const getMonthName = (monthIndex: any) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthIndex - 1]; // Os índices começam em 0, mas os meses começam em 1
  };

  
  const atualizarAdiantamentos = () => {
    getAdiantamentos(paginaAtual, itensPorPagina, currentMonthIndex, selectedYear);
    getQtdAdiantamentos();
    setCurrentPage(paginaAtual);
    console.log(adiantamentos);

    console.log("página corrente: " + currentPage + "itens por página: " + itensPorPagina);
  };

  async function getQtdAdiantamentos(){
    const response = await api.get(`/api/AdiantamentosPagamentos/qtdAdiantamentos`)
    .then(response => {
      setTotalItems(response.data.totalItems);
      setTotalPaginas(Math.ceil(response.data.totalItems / itensPorPagina));
      console.log(response.data.totalItems);
    }).catch(error => {
       toast.error('Erro ao obter o total de itens:', error)
    })
  };
  
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  async function getAdiantamentos(page: number, pageSize: number, mes: number, ano: number) {
    try {
      const response = await api.get(`api/AdiantamentosPagamentos/adiantamentos?page=${page}&pageSize=${pageSize}&mes=${mes}&ano=${ano}`);
      setAdiantamentos(response.data.result);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const indexMonth = getMonthNumber(selectedMonth);
    setCurrentMonthIndex(indexMonth); // Corrigir para armazenar o índice do mês, não o nome
    getAdiantamentos(currentPage, 10, indexMonth, selectedYear);
}, [currentPage, selectedMonth, selectedYear]);

  useEffect(()=>{
    getQtdAdiantamentos()
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

  const handleListarAdiantamentos = (
    selectedMonth: string,
    monthIndex: number
  ) => {
    setSelectedMonth(selectedMonth);
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  async function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>, idAdiantamento: string) {
    event.preventDefault();
    try {
      const response = await api.delete(`/api/AdiantamentosPagamentos/${idAdiantamento}`);
      console.log("IdAtendimento: " + idAdiantamento)
      toast.success("Registro deletado com sucesso.");
    } catch (error) {
      toast.error("Erro ao deletar registro.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  };

  return (
    <Page titulo="Listagem de Adiantamentos">
      <form className="container max-w-full">
        <div className="flex justify-between gap-3">
          <div className="flex gap-3">
            <Link href="">
              <button type="button" className="rounded-md bg-teal-600 hover:bg-teal-900 px-3 py-2 text-sm font-semibold leading-6 text-white" onClick={openModal}>Novo Adiantamento</button>    
            </Link>  
            <Link href={`/adiantamentos/adiantamentos-somados`}>
              <button type="button" className="rounded-md bg-cyan-700 hover:bg-cyan-900 px-3 py-2 text-sm font-semibold leading-6 text-white">Somar Adiantamentos</button>     
            </Link> 
          </div>
          <div className='flex justify-items-start gap-6'>
            <FiltroMes meses={meses} onChange={handleListarAdiantamentos} />
            <AnoSelect onSelectYear={handleSelectYear} />
          </div>
        </div>
        <div className="mt-2 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-12">
            <Modal isOpen={isModalOpen} onClose={closeModal} atualizarAdiantamentos={atualizarAdiantamentos} />  
          </div>
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full border border-collapse">
            <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600 border-r">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right uppercase">Número</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Enfermeiro</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right uppercase">Data de Lançamento</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right uppercase">Valor Adiantamento</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adiantamentos && adiantamentos.map((adiantamento: any) => (
                <tr key={adiantamento.adiantamentoId} className="border-b border-gray-200">
                  <td className="text-right w-20 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{adiantamento.numeroLancamento}</td>
                  <td className="text-left w-96 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{adiantamento.enfermeiro}</td>
                  <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{adiantamento.dataLancamento}</td>
                  <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ {isNaN(parseFloat(adiantamento.valorAdiantamento)) ? 'Valor inválido' : parseFloat(adiantamento.valorAdiantamento).toFixed(2)}</td>
                  <td className="text-center w-24 pb-3 pr-3 border-r border-b border-gray-200">
                    {/* <Link href={`/atendimentos/editar/${adiantamento.adiantamentoId}`}>
                      <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><BiEdit /></button> { }
                    </Link> { } */}
                    <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded" onClick={(event) => handleDeleteClick(event, adiantamento.adiantamentoId)}><FaTrashAlt /></button>
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

export const getStaticProps: GetStaticProps<ListarAdiantamentosProps> = async () => {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return {
    props: {
      meses,
    },
  };
};

export default ListarAdiantamentos;