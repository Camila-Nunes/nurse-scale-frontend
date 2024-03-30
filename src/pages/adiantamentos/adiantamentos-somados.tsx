import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import { toast } from "react-toastify";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { GetStaticProps } from "next";
import { format } from "date-fns";
import { CgSpinnerTwo } from "react-icons/cg";

interface AdiantamentosSomadosProps {
  meses: string[];
}

const AdiantamentosSomados: React.FC<AdiantamentosSomadosProps> = ({ meses }) => {
  const [adiantamentos, setAdiantamentos]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const itensPorPagina = 10;
  const paginaAtual = Math.ceil((totalItems + 1)/itensPorPagina);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  async function getAdiantamentos(page: number, pageSize: number, mes: number, ano: number) {
    try {
      const response = await api.get(`api/AdiantamentosPagamentos/adiantamentos-somados?page=${page}&pageSize=${pageSize}&mes=${mes}&ano=${ano}`);
      setAdiantamentos(response.data.result);
      console.log(response.data.result);
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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

  const handleAdiantamentosListadosSubmit = (
    selectedMonth: string,
    monthIndex: number
  ) => {
    setSelectedMonth(selectedMonth);
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  };

  return (
    <Page titulo="Adiantamentos Somados por mês">
      <form className="container max-w-full">
        <div className="flex justify-between gap-3 ">
          <div className="flex gap-3">
            <Link href="/adiantamentos/listar-adiantamentos">
              <button type="button" className="text-sm font-semibold bg-transparent hover:bg-red-900 text-red-900 hover:text-white py-2 px-4 border border-red-900 hover:border-transparent rounded-md">Voltar</button>    
            </Link>
          </div>
          <div className='flex justify-items-start gap-6'>
            <FiltroMes meses={meses} onChange={handleAdiantamentosListadosSubmit} />
            <AnoSelect onSelectYear={handleSelectYear} />
          </div>
        </div>
        <div className="mt-5 bg-gray-200 rounded-lg p-4 mb-2 max-w-md">
            <h6 className="text-sm">Essa tela traz os valores somados dos adiantamentos agrupados por mês e por profissional</h6>
        </div>
        
        <div className="mt-1 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="mt-1 overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full border border-collapse">
            <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600 border-r">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-left">PROFISSIONAL</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-center">MÊS</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right">TOTAL PROFISSIONAL</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right">TOTAL ADIANTADO</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right">VALOR DIFERENÇA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adiantamentos && adiantamentos.map((adiantamento: any) => (
                <tr key={adiantamento.adiantamentoId} className="border-b border-gray-200">
                  <td className="text-left w-96 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{adiantamento.enfermeiro}</td>
                  <td className="text-center w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{adiantamento.nomeMes}</td>
                  <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ {isNaN(parseFloat(adiantamento.valorProfissional)) ? 'Valor inválido' : parseFloat(adiantamento.valorProfissional).toFixed(2)}</td>
                  <td className="text-right w-24 p-3 text-sm font-bold text-blue-500 whitespace-nowrap border-r border-b border-gray-200">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${isNaN(parseFloat(adiantamento.totalAdiantamento)) ? 'bg-red-500 text-white' : 'bg-teal-500 text-white'}`}>
                      {isNaN(parseFloat(adiantamento.totalAdiantamento)) ? 'Valor inválido' : `R$ ${parseFloat(adiantamento.totalAdiantamento).toFixed(2)}`}
                    </span>
                  </td>
                  <td className="text-right w-24 p-3 text-sm font-bold text-blue-500 whitespace-nowrap border-r border-b border-gray-200">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${isNaN(parseFloat(adiantamento.totalAdiantamento)) ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isNaN(parseFloat(adiantamento.valorDiferenca)) ? 'Valor inválido' : `R$ ${parseFloat(adiantamento.valorDiferenca).toFixed(2)}`}
                    </span>
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

export const getStaticProps: GetStaticProps<AdiantamentosSomadosProps> = async () => {
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

export default AdiantamentosSomados;