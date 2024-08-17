import api from "@/api";
import Page from "@/components/Page";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CgSpinnerTwo } from "react-icons/cg";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { format } from "date-fns";
import { pt } from 'date-fns/locale';
import { GetStaticProps } from "next";

interface AuditoriaProps {
  meses: string[];
}

const Auditoria: React.FC<AuditoriaProps> = ({ meses }) => {
  const [resumoAuditoriaEmpresas, setResumoAuditoriaEmpresas] = useState([]);
  const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(true);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [indexMonth, setIndexMonth] = useState<number>(0);

  const fullMonthName = format(new Date(), 'MMMM', { locale: pt });
  const monthName = fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);

  const [selectedMonth, setSelectedMonth] = useState(monthName);

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const getMonthNumber = (monthName: string) => {
    const monthIndex = meses.indexOf(monthName);
    const numberMonth = monthIndex + 1;
    
    setIndexMonth(numberMonth);

    return numberMonth;
  };

  useEffect(() => {
    const mes = getMonthNumber(selectedMonth);
    setCurrentMonthIndex(mes);
    loadResumoAuditoriaEmpresas(mes, selectedYear);
  }, [selectedMonth, selectedYear]);

  async function loadResumoAuditoriaEmpresas(mes: number, ano: number) {
    try {
      const response = await api.get(
        `/api/Auditoria/buscar-resumo-auditoria-empresa?mes=${mes}&ano=${ano}`
      );
      setResumoAuditoriaEmpresas(response.data);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
        setIsLoadingEmpresas(false);
    }
  }

  const handleTabelaDinamicaSubmit = (
    selectedMonth: string,
    monthIndex: number
  ) => {
    setSelectedMonth(selectedMonth);
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  if (isLoadingEmpresas) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  };

  return(
    <Page titulo="Auditoria">
      <form className="container max-w-full">
        <div className='flex justify-items-start gap-6'>
          <FiltroMes meses={meses} onChange={handleTabelaDinamicaSubmit} />
          <AnoSelect onSelectYear={handleSelectYear} />
        </div>
        <div className="mt-6 mx-auto pt-4 shadow rounded-md bg-slate-50">
          <div className="mt-6 overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full">
              <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                <tr>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left uppercase">Profissional</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left uppercase">Mês</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Atendimentos Realizados</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Saldo Devedor ao Profissional</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Checagem</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Valor Antecipado</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Saldo Devedor Atual ao Profissional</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resumoAuditoriaEmpresas.map((resumoAuditoriaEmpresa: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="font-semibold text-left w-96 p-3 text-sm text-gray-700 whitespace-nowrap">{resumoAuditoriaEmpresa.profissional}</td>
                  <td className="font-semibold text-left w-10 p-3 text-sm text-gray-700 whitespace-nowrap uppercase">{resumoAuditoriaEmpresa.nomeMes}</td>
                  <td className="font-semibold text-right w-80 p-3 text-sm text-gray-700 whitespace-nowrap">{resumoAuditoriaEmpresa.atendimentosRealizados}</td>
                  <td className="font-semibold text-right w-80 p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional)) ? 'bg-red-500 text-white' : 'bg-blue-800 text-white'}`}>
                      R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional).toFixed(2)}
                    </span>
                  </td>
                  <td className="font-semibold text-right w-80 p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional)) ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                      R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional).toFixed(2)}
                    </span>
                  </td>
                  <td className="font-semibold text-right w-96 p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${isNaN(parseFloat(resumoAuditoriaEmpresa.valorAdiantado)) ? 'bg-red-500 text-white' : 'bg-green-800 text-white'}`}>
                      R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.valorAdiantado)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.valorAdiantado).toFixed(2)}
                    </span>
                  </td>
                  <td className="font-semibold text-right w-96 p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`inline-block px-4 py-1 font-semibold rounded ${isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissionalAtual)) ? 'bg-red-500 text-white' : 'bg-red-800 text-white'}`}>
                      R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissionalAtual)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissionalAtual).toFixed(2)}
                    </span>
                  </td>    
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<AuditoriaProps> = async () => {
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

export default Auditoria;