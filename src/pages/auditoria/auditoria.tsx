import api from "@/api";
import Page from "@/components/Page";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CgSpinnerTwo } from "react-icons/cg";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { format } from "date-fns";
import { GetStaticProps } from "next";

interface AuditoriaProps {
  meses: string[];
}

const Auditoria: React.FC<AuditoriaProps> = ({ meses }) => {
  const [resumoAuditoriaEmpresas, setResumoAuditoriaEmpresas] = useState([]);
  const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(true);

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

  useEffect(() => {
    const currentMonthIndex = getMonthNumber(selectedMonth);
    loadResumoAuditoriaEmpresas(currentMonthIndex, selectedYear);
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
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Atendimentos Realizados</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Saldo Devedor aos Profissionais</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Checagem</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Valor Antecipado</th>
                  <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right uppercase">Saldo Devedor ao Profissional</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resumoAuditoriaEmpresas.map((resumoAuditoriaEmpresa: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap">{resumoAuditoriaEmpresa.profissional}</td>
                  <td className="text-right w-72 p-3 text-sm text-gray-700 whitespace-nowrap">{resumoAuditoriaEmpresa.atendimentosRealizados}</td>
                  <td className="text-right w-72 p-3 text-sm text-gray-700 whitespace-nowrap">
                   R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional).toFixed(2)}
                  </td>
                  <td className="text-right w-72 p-3 text-sm text-gray-700 whitespace-nowrap">
                   R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissional).toFixed(2)}
                  </td>
                  <td className="text-right w-72 p-3 text-sm text-gray-700 whitespace-nowrap">
                    R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.valorAdiantado)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.valorAdiantado).toFixed(2)}
                  </td>
                  <td className="text-right w-72 p-3 text-sm text-gray-700 whitespace-nowrap">
                    R$ {isNaN(parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissionalAtual)) ? 'Valor inválido' : parseFloat(resumoAuditoriaEmpresa.saldoDevedorProfissionalAtual).toFixed(2)}  
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