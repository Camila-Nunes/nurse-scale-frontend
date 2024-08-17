"use client"
import { 
    IconNurse, 
    IconAmbulance, 
    IconBed,
    IconCalendarPlus,
    IconWallet,
    IconBusinessplan,
    IconReportMoney,
    IconDashboard
} from "@tabler/icons-react";
import { BiSolidChevronDown, BiChevronUp, BiSearchAlt } from "react-icons/bi";
import { TbMoneybag, TbNurse, TbDashboard } from "react-icons/tb";
import { BsCalendarPlusFill, BsClipboardData, BsCalculator } from "react-icons/bs";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaAmbulance, FaBed } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";
import MenuItem from "./MenuItem";
import { useState } from "react";

export default function Menu() {
  const [showCadastros, setShowCadastros] = useState(false);
  const [showFinanceiro, setShowFinanceiro] = useState(false);
  const [showAdministrativo, setShowAdministrativo] = useState(false);
  const [showConfiguracoes, setShowConfiguracoes] = useState(false);
  const [aberto, setAberto] = useState(false);

  const toggleAdministrativo = () => setShowAdministrativo(!showAdministrativo);
  const toggleCadastros = () => setShowCadastros(!showCadastros);
  const toggleFinanceiro = () => setShowFinanceiro(!showFinanceiro);
  const toggleConfiguracoes = () => setShowConfiguracoes(!showConfiguracoes);

  return (
    <div className="flex flex-col justify-start w-72 text-3xl gap-1">
      <div className="flex justify-between items-center gap-16 text-sm text-zinc-500 pl-3 pt-2">
        <MenuItem icone={<TbDashboard size={20} />} texto="Dashboard" url="/dashboard/dashboard" />  
      </div>
      <div className="flex justify-between items-center gap-16 text-sm text-zinc-500 pl-3 pt-2" onClick={toggleAdministrativo}>
        <span className="text-base text-zinc-500 pl-3 pt-4">Administrativo</span>
        <span className="text-base text-zinc-500 pl-3 pr-10 pt-4">{showAdministrativo ? <BiChevronUp />: <BiSolidChevronDown />}</span>
      </div>
      {showAdministrativo && (
        <div className="pl-6 mr-6">
          <MenuItem icone={<BsCalendarPlusFill size={20}/>} texto="Atendimentos" url="/atendimentos/listar-atendimentos" />
          {/* <MenuItem icone={<BsCalculator size={20}/>} texto="Cálculo Taxa Administrativa" url="/calculos/calculo-taxa-administrativa" />*/}
          <MenuItem icone={<BsClipboardData size={20}/>} texto="Orçamentos" url="/orcamentos/orcamentos" /> 
          <MenuItem icone={<TbMoneybag size={20}/>} texto="Faturamento" url="/administrativo/faturamento" />
          <MenuItem icone={<BiSearchAlt size={20}/>} texto="Auditoria" url="/auditoria/auditoria" />
          <MenuItem icone={<IoCalendarOutline size={20}/>} texto="Escalas" url="/escalas/escalas" />
        </div>
      )}

      <div className="flex justify-between items-center gap-16 text-sm text-zinc-500 pl-3 pt-2" onClick={toggleCadastros}>
        <span className="text-base text-zinc-500 pl-3 pt-4">Cadastros</span>
        <span className="text-base text-zinc-500 pl-3 pr-10 pt-4">{showCadastros ? <BiChevronUp />: <BiSolidChevronDown />}</span>
      </div>
      {showCadastros && (
        <div className="pl-6 mr-6">
          <MenuItem icone={<FaAmbulance size={20}/>} texto="Clientes" url="/clientes/listar-clientes" />
          <MenuItem icone={<TbNurse size={20}/>} texto="Enfermeiros" url="/enfermeiros/listar-enfermeiros" />
          <MenuItem icone={<FaBed size={20}/>} texto="Pacientes" url="/pacientes/listar-pacientes" />
        </div>
      )}

      <div className="flex justify-between items-center gap-16 text-sm text-zinc-500 pl-3 pt-2" onClick={toggleConfiguracoes}>
        <span className="text-base text-zinc-500 pl-3 pt-4">Configurações</span>
        <span className="text-base text-zinc-500 pl-3 pr-10 pt-4">{showConfiguracoes ? <BiChevronUp /> : <BiSolidChevronDown />}</span>
      </div>
      {showConfiguracoes && (
        <div className="pl-6 mr-6">
          <MenuItem icone={<LuAlarmClock size={20}/>} texto="Horários" url="/horarios/listar-horarios" />
          <MenuItem icone={<FaBriefcaseMedical size={20}/>} texto="Assistências" url="/assistencias/listar-assistencias" />
          {/* <MenuItem icone={<FaUserPlus size={22} />} texto="Usuários" url="/usuarios/listar-usuarios" /> */}
        </div>
      )}

      <div className="flex justify-between items-center gap-16 text-sm text-zinc-500 pl-3 pt-2" onClick={toggleFinanceiro}>
        <span className="text-base text-zinc-500 pl-3 pt-4">Financeiro</span>
        <span className="text-base text-zinc-500 pl-3 pr-10 pt-4">{showFinanceiro ? <BiChevronUp /> : <BiSolidChevronDown />}</span>
      </div>
      {showFinanceiro && (
        <div className="pl-6 mr-6">
          <MenuItem icone={<IconReportMoney size={20}/>} texto="Adiantamento" url="/adiantamentos/listar-adiantamentos" />
          {/* <MenuItem icone={<IconBusinessplan />} texto="Fluxo de Caixa" url="/fluxo-de-caixa/fluxo-de-caixa" /> */}
          {/* <MenuItem icone={<IconWallet />} texto="Pagamentos" url="/pagamentos/listar-pagamentos" /> */}
        </div>
      )}
    </div>
  );
}
