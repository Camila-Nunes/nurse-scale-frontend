import { useState, useEffect } from "react";
import api from '@/api';
import Page from "@/components/Page";
import BuscaPaciente from "@/components/BuscaPaciente";
import FiltroMes from "@/components/FiltroMes";
import AnoSelect from "@/components/AnoSelect";
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import ComboBoxClientes from "@/components/ComboBoxClientes ";

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

interface ScheduleProps {
  meses: string[];
}

interface Paciente {
  pacienteId: string;
  nome: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Escalas: React.FC<ScheduleProps> = ({ meses }) => {
  const [escalas, setEscalas] = useState<Schedule[]>([]);
  const [calendar, setCalendar] = useState<{ [key: string]: { [key: string]: Schedule[] } }>({}); // Calendar data
  const [pacienteId, setPacienteId] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  const [indexMonth, setIndexMonth] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

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

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEscala(indexMonth, ano, pacienteId, clienteId);
      console.log('Dados recebidos:', data);

      // Initialize calendar
      const calendarMap: { [key: string]: { [key: string]: Schedule[] } } = {};

      // Fill calendar data
      data.forEach(escala => {
        const date = new Date(escala.dataAtendimento);
        const day = date.getDate();
        const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week index
        const weekNumber = Math.ceil((day + new Date(ano, indexMonth - 1, 1).getDay()) / 7); // Calculate week number
        const weekKey = String(weekNumber); // Convert to string for object keys

        if (!calendarMap[weekKey]) {
          calendarMap[weekKey] = {};
        }

        if (!calendarMap[weekKey][dayOfWeek]) {
          calendarMap[weekKey][dayOfWeek] = [];
        }

        calendarMap[weekKey][dayOfWeek].push(escala);
      });

      setCalendar(calendarMap);
    };

    if (pacienteId && clienteId) {
      fetchData();
    }
  }, [indexMonth, ano, pacienteId, clienteId]);

  const handlePacienteSelecionado = async (paciente: Paciente) => {
    setPacienteId(paciente.pacienteId);
  };

  const handleSelectCliente = (id: string) => {
    setClienteId(id);
  };

  const handleAtendimentosSubmit = async (selectedMonth: string, monthIndex: number) => {
    setMes(selectedMonth);
    getMonthNumber(selectedMonth);
  };

  const handleSelectYear = (year: number) => {
    setAno(year);
  };

  return (
    <Page titulo="Escalas">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Escala do Mês</h1>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 border-b pb-4"> 
            <div className="sm:col-span-6">
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
              <div className="mt-4">
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
          <table className="min-w-full bg-white border-collapse mt-2">
            <thead>
              <tr>
                {daysOfWeek.map((day, index) => (
                  <th key={index} className="py-2 px-4 border-b border-gray-300 text-sm text-center bg-teal-900 text-slate-300">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(calendar).map(weekNumber => (
                <tr key={weekNumber}>
                  {daysOfWeek.map(dayOfWeek => {
                    const cellData = calendar[weekNumber]?.[dayOfWeek] || [];
                    return (
                      <td key={dayOfWeek} className="py-2 px-4 border-b border-gray-300 text-sm text-center">
                        {cellData.length > 0 ? (
                          <>
                            <div><strong>{formatDate(cellData[0].dataAtendimento)}</strong></div>
                            <div className="text-left"><strong>Profissional:</strong> {cellData[0].profissional}</div>
                            {cellData.map((escala, index) => (
                              <div className="text-left" key={index}>
                                <div><strong>Horário:</strong> {escala.horario}</div>
                              </div>
                            ))}
                          </>
                        ) : (
                          ''
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
