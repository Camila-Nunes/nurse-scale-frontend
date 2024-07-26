import { useState, useEffect } from "react";
import api from '@/api';
import Page from "@/components/Page";

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Escalas: React.FC = () => {
  const [escalas, setEscalas] = useState<Schedule[]>([]);
  const [calendar, setCalendar] = useState<{ [key: number]: { [key: string]: Schedule[] } }>({}); // Calendar data

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
      const data = await getEscala(7, 2024, 'A62FF358-45FE-4911-95B6-B80F9F39433F', 'DD7DD642-F407-4039-B5DD-D7BD36774BAE');
      console.log('Dados recebidos:', data);

      // Initialize calendar
      const calendarMap: { [key: number]: { [key: string]: Schedule[] } } = {};

      // Fill calendar data
      data.forEach(escala => {
        const date = new Date(escala.dataAtendimento);
        const day = date.getDate();
        const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week index
        const weekNumber = Math.ceil((day + new Date(2024, 6, 1).getDay()) / 7); // Calculate week number

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

    fetchData();
  }, []); // Dependências vazias garantem que o efeito seja executado apenas uma vez após a montagem do componente

  return (
    <Page titulo="Escalas">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Escala do Mês</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                {daysOfWeek.map((day, index) => (
                  <th key={index} className="py-2 px-4 border-b border-gray-300 text-sm text-center">{day}</th>
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
                            <div><strong>Profissional:</strong> {cellData[0].profissional}</div>
                            {cellData.map((escala, index) => (
                              <div key={index}>
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
