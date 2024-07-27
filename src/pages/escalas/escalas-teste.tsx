import { useState, useEffect } from "react";
import api from '@/api';
import Page from "@/components/Page";
import BuscaPaciente from "@/components/BuscaPaciente";
import FiltroMes from "@/components/FiltroMes";
import { GetStaticProps } from 'next';
import ComboBoxClientes from "@/components/ComboBoxClientes ";
import AnoSelect from "@/components/AnoSelect";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export interface Schedule {
  diaDaSemana: string;
  horario: string; // E.g., '07:00' or '19:00'
  dataAtendimento: string; // Assumed format 'YYYY-MM-DD'
  assistencia: string;
  paciente: string;
  profissional: string;
  localAtendimento: string;
  estadoAtendimento: string;
}

const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

interface ScheduleProps {
  meses: string[];
}

const Escalas: React.FC<ScheduleProps> = ({ meses }) => {
  const [escalas, setEscalas] = useState<Schedule[]>([]);
  const [calendar, setCalendar] = useState<{ [key: number]: { [key: string]: Schedule[] } }>({}); // Calendar data
  const [pacienteId, setPacienteId] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  //const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [indexMonth, setIndexMonth] = useState<number>(new Date().getMonth() + 1);
  
  const fullMonthName = format(new Date(), 'MMMM', { locale: pt });
  const monthName = fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);

  const [mes, setMes] = useState(monthName);

  const getMonthNumber = (monthName: string): number => {
    const monthIndex = meses.indexOf(monthName);
    const numberMonth = monthIndex + 1;

    setIndexMonth(numberMonth);

    return numberMonth;
  };

  const getEscala = async (mes: number, ano: number, pacienteId: string, clienteId: string): Promise<Schedule[]> => {
    try {
      const response = await api.get('/api/Escalas', {
        params: {
          pacienteId,
          clienteId,
          mes,
          ano
        }
      });

      console.log('Resposta da API:', response.data);

      if (response.data && response.data.data) {
        return response.data.data as Schedule[];
      } else {
        console.error('Nenhum dado retornado do backend');
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar dados das escalas:', error);
      return [];
    }
  };

  const fetchData = async () => {
    const data = await getEscala(indexMonth, ano, pacienteId, clienteId);
    console.log('Dados recebidos:', data);

    // Initialize calendar
    const calendarMap: { [key: number]: { [key: string]: Schedule[] } } = {};

    // Fill calendar data
    data.forEach(escala => {
      const date = new Date(escala.dataAtendimento);
      const day = date.getDate();
      const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week index
      const weekNumber = Math.ceil((day + new Date(ano, indexMonth - 1, 1).getDay()) / 7); // Calculate week number

      if (!calendarMap[weekNumber]) {
        calendarMap[weekNumber] = {};
      }

      if (!calendarMap[weekNumber][dayOfWeek]) {
        calendarMap[weekNumber][dayOfWeek] = [];
      }

      calendarMap[weekNumber][dayOfWeek].push(escala);
    });

    setCalendar(calendarMap);
  };

  useEffect(() => {
    fetchData();
  }, [mes, ano, pacienteId, clienteId]); // Dependências garantem que o efeito seja executado quando os filtros mudarem

  const handlePacienteSelecionado = (id: string) => {
    setPacienteId(id);
  };

  const handleSelectCliente = (id: string) => {
    setClienteId(id);
  };

  // const handleSelectMonth = (selectedMonth: string) => {
  //   const monthNumber = getMonthNumber(selectedMonth);
  //   setMes(monthNumber);
  // };

  const handleSelectYear = (year: number) => {
    setAno(year);
  };

  const handleAtendimentosSubmit = async (selectedMonth: string, monthIndex: number) => {
    setMes(selectedMonth);
    const mes = getMonthNumber(selectedMonth);
  };

  return (
    <Page titulo="Escalas">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Escala do Mês</h1>
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="sm:col-span-5">
              <label htmlFor="paciente" className="block text-sm font-medium leading-6 text-gray-900">Paciente</label>
              <div className="mt-2">
                <BuscaPaciente onPacienteSelecionado={handlePacienteSelecionado} />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="empresa" className="block text-sm font-medium leading-6 text-gray-900">Empresa</label>
              <div className="mt-2">
                <ComboBoxClientes onSelectCliente={handleSelectCliente} />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mes" className="block text-sm font-medium leading-6 text-gray-900">Mês</label>
              <div className="mt-2">
              <FiltroMes meses={meses} onChange={handleAtendimentosSubmit} /> 
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ano" className="block text-sm font-medium leading-6 text-gray-900">Ano</label>
              <div className="mt-2">
                <AnoSelect onSelectYear={handleSelectYear} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Render calendar here */}
        {Object.keys(calendar).map((weekNumber) => (
          <div key={weekNumber} className="mb-4">
            <h2 className="text-xl font-semibold">Semana {weekNumber}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {daysOfWeek.map((day) => (
                <div key={day} className="border p-4">
                  <h3 className="text-lg font-medium">{day}</h3>
                  {calendar[weekNumber][day] && calendar[weekNumber][day].map((escala, index) => (
                    <div key={index} className="mb-2">
                      <p>Horário: {escala.horario}</p>
                      <p>Paciente: {escala.paciente}</p>
                      <p>Profissional: {escala.profissional}</p>
                      <p>Local: {escala.localAtendimento}</p>
                      <p>Estado: {escala.estadoAtendimento}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default Escalas;

export const getStaticProps: GetStaticProps<ScheduleProps> = async () => {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return {
    props: {
      meses,
    },
  };
};
