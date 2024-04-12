import Page from "@/components/Page";
import { useEffect, useState } from "react";
import api from '../../api';
import { toast } from "react-toastify";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "@/components/Pagination";

const itensPorPagina = 10;

export default function ListarAdiantamentos() {
  const [pagamentos, setPagamentos]=useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  async function getAdiantamentos(page: number, pageSize: number){
    const response = await api.get(`api/AdiantamentosPagamentos?page=${page}&pageSize=${pageSize}`)
    .then(response => {
      setPagamentos(response.data.result);
      console.log(response.data.result);
    }).catch(error => {
       toast.error("Erro ao carregar dados. " + error)
    })
  };

  useEffect(()=>{
    getAdiantamentos(currentPage, 10)
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (pagina: number) => {
    setCurrentPage(pagina);
  };

  return (
    <Page titulo="Listagem de Pagamentos">
      <form className="container max-w-full">
        <div className="mt-2 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-12">
            
          </div>
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full border border-collapse">
            <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600 border-r">
              <tr>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Profissional</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right ">Valor Total Empresa</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right ">Valor Total Profissional</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right ">Lucro</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right ">Valor Adiantamento</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-right ">Diferença</th>
                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r text-center ">Status Pagamento</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pagamentos && pagamentos.map((pagamento: any) => (
                <tr key={pagamento.enfermeiroId} className="border-b border-gray-200">
                  <td className="text-left w-96 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">{pagamento.enfermeiro}</td>
                  <td className="text-right w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"> R$ {isNaN(parseFloat(pagamento.valorTotalEmpresa)) ? 'Valor inválido' : parseFloat(pagamento.valorTotalEmpresa).toFixed(2)}</td>
                  <td className="text-right w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"> R$ {isNaN(parseFloat(pagamento.valorTotalProfissional)) ? 'Valor inválido' : parseFloat(pagamento.valorTotalProfissional).toFixed(2)}</td>
                  <td className="text-right w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"> R$ {isNaN(parseFloat(pagamento.valorTotalLucro)) ? 'Valor inválido' : parseFloat(pagamento.valorTotalLucro).toFixed(2)}</td>
                  <td className="text-right w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"> R$ {isNaN(parseFloat(pagamento.valorTotalAdiantamento)) ? 'Valor inválido' : parseFloat(pagamento.valorTotalAdiantamento).toFixed(2)}</td>
                  <td className="text-right w-36 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200"> R$ {isNaN(parseFloat(pagamento.valorTotalDiferenca)) ? 'Valor inválido' : parseFloat(pagamento.valorTotalDiferenca).toFixed(2)}</td>
                  <td className="text-center w-36 p-3 text-sm whitespace-nowrap border-r border-b">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${pagamento.statusPagamento === 'EM ANDAMENTO' ? 'bg-yellow-200' : pagamento.statusPagamento === 'NÃO INICIADO' ? 'bg-blue-200' : pagamento.statusPagamento === 'FINALIZADO' ? 'bg-green-400' : 'bg-gray-300'}`}>
                      {pagamento.statusPagamento}
                    </span>
                  </td>
                  <td className="text-center w-36 pb-3 pr-3 border-r border-b border-gray-200">
                    <Link href={`/atendimentos/editar/${pagamento.atendimentoId}`}>
                      <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><BiEdit /></button> { }
                    </Link> { }
                    <button className="bg-white hover:bg-gray-700 hover:text-white text-gray-600 text-lg font-semibold py-2 px-4 rounded"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPaginas}
            totalRecords={0}
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