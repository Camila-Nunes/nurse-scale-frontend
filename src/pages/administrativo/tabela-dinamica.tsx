import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import api from "@/api";
import Page from "@/components/Page";
import { toast } from "react-toastify";
import { CgSpinnerTwo } from "react-icons/cg";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { GetStaticProps } from "next";

interface TabelaDinamicaProps {
  meses: string[];
}

const TabelaDinamica: React.FC<TabelaDinamicaProps> = ({ meses }) => {
  const [resumoEmpresas, setResumoEmpresas] = useState([]);
  const [resumoProfissionais, setResumoProfissionais] = useState([]);
  const [resumoAtendimentos, setResumoAtendimentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM")
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const router = useRouter();

  const getMonthNumber = (monthName: string) => {
    const monthIndex = meses.indexOf(monthName);
    return monthIndex + 1;
  };

  const loadTabelaDinamicaData = async (monthIndex: number) => {
    try {
      await Promise.all([
        getResumoAtendimentos(monthIndex, selectedYear),
        getResumoEmpresa(monthIndex, selectedYear),
      ]);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    }
  };

  useEffect(() => {
    const currentMonthIndex = getMonthNumber(selectedMonth);
    loadTabelaDinamicaData(currentMonthIndex);
  }, [selectedMonth, selectedYear]);

  async function getResumoEmpresa(mes: number, ano: number) {
    try {
      const response = await api.get(
        `/api/TabelaDinamica/resumo-por-empresa?mes=${mes}&ano=${ano}`
      );
      setResumoEmpresas(response.data);
      setResumoProfissionais(response.data);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getResumoAtendimentos(mes: number, ano: number) {
    try {
      const response = await api.get(
        `/api/TabelaDinamica/resumo-por-atendimento?mes=${mes}&ano=${ano}`
      );
      setResumoAtendimentos(response.data);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTabelaDinamicaSubmit = (
    selectedMonth: string,
    monthIndex: number
  ) => {
    setSelectedMonth(selectedMonth);
    loadTabelaDinamicaData(monthIndex);
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  const handlePrevMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currentIndex = meses.indexOf(selectedMonth);
    const newIndex = (currentIndex - 1 + meses.length) % meses.length;
    handleMonthChange(meses[newIndex]);
  };

  const handleNextMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currentIndex = meses.indexOf(selectedMonth);
    const newIndex = (currentIndex + 1) % meses.length;
    handleMonthChange(meses[newIndex]);
  };

  const handleMonthChange = (newSelectedMonth: string) => {
    setSelectedMonth(newSelectedMonth);
    const monthIndex = getMonthNumber(newSelectedMonth);
    loadTabelaDinamicaData(monthIndex);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  }

  return (
        <Page titulo="Tabela Dinâmica">
            <form className="container max-w-full">
                <div className='flex justify-start gap-6'>
                    <FiltroMes meses={meses} onChange={handleTabelaDinamicaSubmit} />
                    <AnoSelect onSelectYear={handleSelectYear} />
                </div>
                <div className="mt-4 mx-auto shadow rounded-md bg-slate-50">
                    <div className="mt-2 overflow-auto rounded-lg shadow hidden md:block">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-12">
                                <div className="sm:col-span-4 px-5">
                                    <table className="w-full rounded-md">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Total Empresa</th>
                                            </tr>
                                        </thead> 
                                        <tbody className="divide-y divide-gray-100">
                                            {resumoEmpresas && resumoEmpresas.map((resumoEmpresa: any, index: number) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        {resumoEmpresa.nome_Fantasia}
                                                    </td>
                                                    <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        R$ {isNaN(parseFloat(resumoEmpresa.valor_Empresa)) ? 'Valor inválido' : parseFloat(resumoEmpresa.valor_Empresa).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody> 
                                    </table>             
                                </div>
                                <div className="sm:col-span-4 px-5">
                                    <table className="w-full">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Total Profissional</th>
                                            </tr>
                                        </thead> 
                                        <tbody className="divide-y divide-gray-100">
                                        {resumoProfissionais && resumoProfissionais.map((resumoProfissional: any, index: number) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        {resumoProfissional.nome_Fantasia}
                                                    </td>
                                                    <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        R$ {isNaN(parseFloat(resumoProfissional.valor_Profissional)) ? 'Valor inválido' : parseFloat(resumoProfissional.valor_Profissional).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody> 
                                    </table>             
                                </div>
                                <div className="sm:col-span-4 px-5">
                                    <table className="w-full">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Bruto</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Liquido</th>
                                            <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Imposto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        <tr className="border-b border-gray-200">
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 25.000,00</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 20.000,00</td>
                                                <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">R$ 5.000,00</td>
                                            </tr>
                                        </tbody>
                                    </table>             
                                </div>
                                <div className="sm:col-span-12 px-5 mt-10">
                                    <table className="w-full">
                                        <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                                            <tr>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Empresa</th>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Procedimentos</th>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r">Tipo de Atendimento</th>
                                                <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r">Soma Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {resumoAtendimentos && resumoAtendimentos.map((resumoAtendimento: any, index: number) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        {resumoAtendimento.nome_Fantasia}
                                                    </td>
                                                    <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        {resumoAtendimento.total}
                                                    </td>
                                                    <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        {resumoAtendimento.tipo_Assistencia}
                                                    </td>
                                                    <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200">
                                                        R$ {isNaN(parseFloat(resumoAtendimento.valor_Profissional)) ? 'Valor inválido' : parseFloat(resumoAtendimento.valor_Profissional).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div> 
            </form>
        </Page>
    );
};

export const getStaticProps: GetStaticProps<TabelaDinamicaProps> = async () => {
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

export default TabelaDinamica;
