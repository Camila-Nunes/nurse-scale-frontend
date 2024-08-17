"use client"

import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { GetStaticProps } from 'next';
import FiltroMes from '@/components/FiltroMes';
import Card from '@/components/Card';
import CardPorcentagem from '@/components/CardPorcentagem';
import Page from '@/components/Page';
import api from '@/api';
import { toast } from 'react-toastify';
import { MdOutlineMoneyOffCsred, MdOutlinePercent } from "react-icons/md";
import { GiLion } from "react-icons/gi";
import { CgMathPercent } from "react-icons/cg";
import { BiInjection } from "react-icons/bi";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import AnoSelect from '@/components/AnoSelect';

interface DashboardProps {
  meses: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ meses }) => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM'));
  const [selectedYear, setSelectedYear] = useState(0);
  const startDate = startOfMonth(new Date(selectedMonth));
  const endDate = endOfMonth(new Date(selectedMonth));
  const [atendimentosNoMes, setAtendimentosNoMes] = useState(0);
  const [atendimentosPagos, setAtendimentosPagos] = useState(0);
  const [entradasMes, setEntradasMes] = useState(0);
  const [faltaPagar, setFaltaPagar] = useState(0);
  const [valorLucro, setValorLucro] = useState(0);

  const [mes, setMes] = useState(0);
  const [ano, setAno] = useState(0);
  const [total, setTotal] = useState(0);
  const [valorEmpresa, setValorEmpresa] = useState(0);
  const [valorProfissional, setValorProfissional] = useState(0);
  const [imposto, setImposto] = useState(0);
  const [margem, setMargem] = useState(0);
  const [porcentagemLiquida, setPorcentagemLiquida] = useState(0);

  const [quantityAtendimentosMes, setQuantityAtendimentosMes] = useState(0);
  const [quantityAtendimentosPagos, setQuantityAtendimentosPagos] = useState(0);
  const [quantityAtendimentosEntradasMes, setQuantityAtendimentosEntradasMes] = useState(0);
  const [quantityAtendimentosNaoPagos, setQuantityAtendimentosNaoPagos] = useState(0);

  const getMonthNumber = (monthName: string) => {
    const monthIndex = meses.indexOf(monthName);
    return monthIndex + 1;
  };

  const loadDashboardData = async (monthIndex: number) => {
    try {
      await Promise.all([
        getQtdAtendimentosMes(monthIndex, selectedYear),
        getQtdAtendimentosPagosMes(monthIndex, selectedYear),
        getEntradasMes(monthIndex, selectedYear),
        getQtdAtendimentosNaoPagosMes(monthIndex, selectedYear),
        getLucrosMes(monthIndex, selectedYear),
        getReumosMes(monthIndex, selectedYear),
      ]);
    } catch (error) {
      toast.error('Erro ao carregar o dashboard.');
    }
  };

  useEffect(() => {
    const currentMonthIndex = getMonthNumber(selectedMonth);
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);
    loadDashboardData(currentMonthIndex);
  }, []);

  async function getReumosMes(mes: number, ano: number) {
    try {
      const response = await api.get(`api/Dashboard/dashboard-resumos?mes=${mes}&ano=${ano}`);
      const { total, valorEmpresa, valorProfissional, imposto, margem, porcentagemLiquida } = response.data;
  
      setTotal(total);
      setValorEmpresa(valorEmpresa);
      setValorProfissional(valorProfissional);
      setImposto(imposto);
      setMargem(margem);
      setPorcentagemLiquida(porcentagemLiquida);
      setTotal(total);

    } catch (error) {
      toast.error('Erro ao obter o total de itens.');
    }
  };


  async function getQtdAtendimentosMes(mes: number, ano: number) {
    try {
      const response = await api.get(`api/Dashboard/dashboard-atendimentos-mes?mes=${mes}&ano=${ano}`);
      const { mesAtual, valor, quantidade } = response.data;
  
      setAtendimentosNoMes(valor);
      setQuantityAtendimentosMes(quantidade);
    } catch (error) {
      toast.error('Erro ao obter o total de itens.');
    }
  };

  async function getLucrosMes(mes: number, ano: number) {
    try {
      const response = await api.get(`api/Dashboard/dashboard-lucros-mes?mes=${mes}&ano=${ano}`);
      const { valorLucro } = response.data;
  
      setValorLucro(valorLucro);
    } catch (error) {
      toast.error('Erro ao obter o total de itens.');
    }
  };

  async function getQtdAtendimentosPagosMes(mes: number, ano: number) {
    try {
      const response = await api.get(`/api/Dashboard/dashboard-atendimentos-pagos-mes?mes=${mes}&ano=${ano}`);
      const { mesAtual, valor, quantidade } = response.data;
  
      setAtendimentosPagos(valor);
      setQuantityAtendimentosPagos(quantidade);
    } catch (error) {
      toast.error('Erro ao obter o total de itens.');
    }
  };

  async function getEntradasMes(mes: number, ano: number){
    try {
      const response = await api.get(`/api/Dashboard/dashboard-atendimentos-entradas-mes?mes=${mes}&ano=${ano}`);
      const { mesAtual, valor, quantidade } = response.data;
  
      setEntradasMes(valor);
      setQuantityAtendimentosEntradasMes(quantidade);
    } catch (error) {
      toast.error('Erro ao obter o total de itens.');
    }
  };

  async function getQtdAtendimentosNaoPagosMes(mes: number, ano: number){
    try {
      const response = await api.get(`/api/Dashboard/dashboard-atendimentos-nao-pagos-mes?mes=${mes}&ano=${ano}`);
      const { mesAtual, valor, quantidade } = response.data;
  
      setFaltaPagar(valor);
      setQuantityAtendimentosNaoPagos(quantidade);
    } catch (error) {
      toast.error('Erro ao obter o total de itens.');
    }
  };

  const handleDashboardSubmit = async (selectedMonth: string, monthIndex: number) => {
    setSelectedMonth(selectedMonth);
    loadDashboardData(monthIndex);
  };

  const handleSelectYear = (year: number) => {
    console.log({year});
    setSelectedYear(year);
  };

  return (
    <Page titulo="Dashboard">
      <div className="container max-w-full">
        <div className='flex justify-end gap-6'>
          <FiltroMes meses={meses} onChange={handleDashboardSubmit} />
          <AnoSelect onSelectYear={handleSelectYear} />
        </div>
        
        {/* <button onClick={(e) => handleDashboardSubmit(e)}>Carregar Dashboard</button> */}
        <div className="sm:grid-cols-12">
          <div className="grid grid-cols-6 gap-4 mt-8">
            <Card title="Projeção de Faturamento" icon={HiArrowCircleUp} value={valorEmpresa} color="bg-teal-600"/>
            <Card title="Projeção de Produção" icon={HiArrowCircleDown} value={valorProfissional} color="bg-teal-700"/>
            <Card title="Imposto(Nota Fiscal)" icon={GiLion} value={imposto} color="bg-teal-800"/>
            <Card title="Margem Total Líquida" icon={MdOutlineMoneyOffCsred} value={margem} color="bg-teal-900"/>
            <CardPorcentagem title="Porcentagem Total Líquida" icon={MdOutlinePercent} value={porcentagemLiquida} color="bg-emerald-700"/>
            <Card title="Total Atendimentos" icon={BiInjection} quantity={total} color="bg-emerald-800"/>
          </div>
        </div>  
        {/* <div className="sm:grid-cols-12">
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Card title="Lucro" icon={TbPigMoney} value={valorLucro} color="bg-sky-900"/>
            <Card title="Orçamento Minimo" value={150} color="bg-teal-600"/>
          </div>
        </div> */}
      </div>
    </Page>
  );
};

export const getStaticProps: GetStaticProps<DashboardProps> = async () => {
  // Gere os meses dinamicamente ou carregue de uma API
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return {
    props: {
      meses,
    },
  };
};

export default Dashboard;
