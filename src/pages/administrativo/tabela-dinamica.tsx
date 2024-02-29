import React, { useEffect, useState } from "react";
import NumberFormat from 'react-number-format';
import { format } from "date-fns";
import { useRouter } from "next/router";
import api from "@/api";
import Page from "@/components/Page";
import { Slide, toast } from "react-toastify";
import { CgSpinnerTwo } from "react-icons/cg";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { GetStaticProps } from "next";
import { BsDatabaseX } from "react-icons/bs";
import InputMask from "react-input-mask";

interface TabelaDinamicaProps {
  meses: string[];
}

const TabelaDinamica: React.FC<TabelaDinamicaProps> = ({ meses }) => {
    const [resumoEmpresas, setResumoEmpresas] = useState([]);
    const [resumoProfissionais, setResumoProfissionais] = useState([]);
    const [resumoAtendimentos, setResumoAtendimentos] = useState([]);
    const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(true);
    const [isLoadingAtendimentos, setIsLoadingAtendimentos] = useState(true);
    const [valorAliquota, setValorAliquota] = useState('');
    const [aliquotaPorcento, setAliquotaPorcento] = useState(0);

    useEffect(() => {
      const valorNumerico = parseFloat(valorAliquota);
  
      if (!isNaN(valorNumerico)) {
        const porcentagem = (valorNumerico / 100);
        setAliquotaPorcento(porcentagem);
      } else {
        setAliquotaPorcento(0);
      }
    }, [valorAliquota]);

  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM")
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
    loadResumoEmpresas(currentMonthIndex, selectedYear);
    loadResumoAtendimentos(currentMonthIndex, selectedYear);
    loadValorAliquota();
  }, [selectedMonth, selectedYear]);

  async function loadResumoEmpresas(mes: number, ano: number) {
    try {
      const response = await api.get(
        `/api/TabelaDinamica/resumo-por-empresa?mes=${mes}&ano=${ano}`
      );
      setResumoEmpresas(response.data);
      setResumoProfissionais(response.data);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
        setIsLoadingEmpresas(false);
    }
  }

  async function loadResumoAtendimentos(mes: number, ano: number) {
    try {
      const response = await api.get(
        `/api/TabelaDinamica/resumo-por-atendimento?mes=${mes}&ano=${ano}`
      );
      setResumoAtendimentos(response.data);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
        setIsLoadingAtendimentos(false);
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
  };

  if (isLoadingEmpresas || isLoadingAtendimentos) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CgSpinnerTwo className="animate-spin text-teal-600" size={100} />
      </div>
    );
  };

  const handleInputChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const valorFormatado = valorAliquota.replace(/[^\d,.]/g, '');
      const valorFormatadoPonto = valorFormatado.replace(',', '.');
      const response = await api.post(`/api/TabelaDinamica/alterar-aliquota?valorAliquota=${valorFormatadoPonto}`);
      setValorAliquota(response.data);
      
      toast.success('Alíquota inserida ou atualizada com sucesso', {
        transition: Slide,
        icon: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados.", {
        transition: Slide,
        icon: true,
      });
    }
  };
  
  const handleValorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValorAliquota(event.target.value);
  };

  async function loadValorAliquota() {
    try {
      const response = await api.get(
        `/api/TabelaDinamica/buscar-aliquota`
      );
      setValorAliquota(response.data);
    } catch (error) {
      toast.error("Erro ao carregar dados. " + error);
    } finally {
        setIsLoadingAtendimentos(false);
    }
  }

  return (
    <Page titulo="Tabela Dinâmica">
    <form className="container max-w-full" onSubmit={handleInputChange}>
      <div className='flex justify-items-start gap-6'>
        <FiltroMes meses={meses} onChange={handleTabelaDinamicaSubmit} />
        <AnoSelect onSelectYear={handleSelectYear} />
      </div>
      <div className="mt-4 mx-auto shadow rounded-md bg-slate-50">
        <div className="mt-2 overflow-auto rounded-lg shadow hidden md:block">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-2 px-5">
                <label htmlFor="rg" className="block text-sm font-medium leading-6 text-gray-900 uppercase">Alíquota</label>
                <div className="mt-2">
                  <InputMask mask="99,99%" 
                    type="text"
                    name="aliquota"
                    id="aliquota"
                    value={valorAliquota}
                    onChange={handleValorChange}
                    autoComplete="aliquota"
                    className="font-bold block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>  
              <div className="sm:col-span-3 px-5 mt-6">
                <button type="submit" className="rounded-md bg-teal-600 px-10 py-2 text-sm font-semibold leading-6 text-white hover:bg-teal-700">Alterar Alíquota</button>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-12">
              {(resumoEmpresas && resumoEmpresas.length > 0) ? (
                <div className="sm:col-span-3 px-5">
                  <table className="w-full rounded-md">
                    <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                      <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Empresa</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r uppercase">Total Negociado Empresa</th>
                      </tr>
                    </thead> 
                    <tbody className="divide-y divide-gray-100">
                      {resumoEmpresas.map((resumoEmpresa: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">
                            {resumoEmpresa.nome_Fantasia}
                          </td>
                          <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">
                            R$ {isNaN(parseFloat(resumoEmpresa.valor_Empresa)) ? 'Valor inválido' : parseFloat(resumoEmpresa.valor_Empresa).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody> 
                  </table>             
                </div>
              ) : null}
              {(resumoProfissionais && resumoProfissionais.length > 0) ? (
                <div className="sm:col-span-4 px-5">
                  <table className="w-full">
                    <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                      <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Empresa</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r uppercase">Total Negociado Profissional</th>
                      </tr>
                    </thead> 
                    <tbody className="divide-y divide-gray-100">
                      {resumoProfissionais.map((resumoProfissional: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="text-left w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">
                            {resumoProfissional.nome_Fantasia}
                          </td>
                          <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">
                            R$ {isNaN(parseFloat(resumoProfissional.valor_Profissional)) ? 'Valor inválido' : parseFloat(resumoProfissional.valor_Profissional).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody> 
                  </table>             
                </div>
              ) : null}
              {(resumoAtendimentos && resumoAtendimentos.length > 0) ? (
                <div className="sm:col-span-4 px-5">
                  <table className="w-full">
                    <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                      <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r uppercase bg-cyan-600">Imposto(Nota Fiscal)</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r uppercase bg-green-700">Margem Líquida</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left text-right border-r uppercase bg-sky-800">Porcentagem Líquida</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="border-b border-gray-200">
                        <td className="text-right w-24 p-3 text-sm font-semibold text-cyan-600 whitespace-nowrap border-r border-b border-gray-200 uppercase">R$ 25.000,00</td>
                        <td className="text-right w-24 p-3 text-sm font-semibold text-green-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">R$ 20.000,00</td>
                        <td className="text-right w-24 p-3 text-sm font-semibold text-sky-800 whitespace-nowrap border-r border-b border-gray-200 uppercase">R$ 5.000,00</td>
                        </tr>
                    </tbody>
                  </table>             
                </div>
              ) : null}
              {(resumoAtendimentos && resumoAtendimentos.length > 0) ? (
                <div className="sm:col-span-12 px-5 mt-10">
                  <table className="w-full">
                    <thead className="text-left text-white border-b-2 border-gray-200 bg-teal-600">
                      <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Empresa</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Modalidade</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Valor de Produção</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Projeção de Faturamento</th>
                        <th className="p-3 text-sm font-semibold tracking-wide ext-left border-r uppercase">Qtd. Procedimentos Realizados</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {resumoAtendimentos && resumoAtendimentos.map((resumoAtendimento: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="text-left w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">{resumoAtendimento.nome_Fantasia}</td>
                          <td className="text-right w-72 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">{resumoAtendimento.tipo_Assistencia}</td>
                          <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">
                              R$ {isNaN(parseFloat(resumoAtendimento.valor_Profissional)) ? 'Valor inválido' : parseFloat(resumoAtendimento.valor_Profissional).toFixed(2)}
                          </td>
                          <td className="text-right w-24 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">
                              R$ {isNaN(parseFloat(resumoAtendimento.valor_Empresa)) ? 'Valor inválido' : parseFloat(resumoAtendimento.valor_Empresa).toFixed(2)}
                          </td>
                          <td className="text-right w-12 p-3 text-sm text-gray-700 whitespace-nowrap border-r border-b border-gray-200 uppercase">{resumoAtendimento.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {(resumoEmpresas.length === 0 && resumoProfissionais.length === 0 && resumoAtendimentos.length === 0) && (
                <div className="sm:col-span-12 flex flex-col items-center justify-center">
                  <p className="text-center text-gray-700 mb-2">Não há dados a serem exibidos para o mês de  {selectedMonth}.</p>
                  <span className="text-9xl text-gray-800 mt-40"><BsDatabaseX /></span>
                </div>
              )}
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
