import { useState, useEffect } from "react";
import api from '@/api';
import Page from "@/components/Page";

export interface Schedule {
  diaDaSemana: string;
  horario: string;
  dataAtendimento: string;
  assistencia: string;
  paciente: string;
  profissional: string;
  localAtendimento: string;
  estadoAtendimento: string;
}

const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const Escalas: React.FC = () => {
  const [escalas, setEscalas] = useState<Schedule[]>([]);

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
      const data = await getEscala(7, 2024, '88AC9980-D456-41A2-91CB-5772DA6B17B3', '77410988-26A8-4075-89D7-131DE6783180');
      console.log('Dados recebidos:', data);
      setEscalas(data);
    };

    fetchData();
  }, []); // Dependências vazias garantem que o efeito seja executado apenas uma vez após a montagem do componente

  if (!Array.isArray(escalas)) {
    console.error('O estado escalas não é um array:', escalas);
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <Page titulo="Escalas">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Escala do Mês</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 text-sm text-left">Dia da Semana</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm text-left">Horário</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm text-center">Data Atendimento</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm text-left">Assistência</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm text-left">Paciente</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm text-left">Profissional</th>
              </tr>
            </thead>
            <tbody>
              {escalas.map((escala, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm text-left">{escala.diaDaSemana}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm text-left">{escala.horario}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm text-center">{new Date(escala.dataAtendimento).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm text-left">{escala.assistencia}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm text-left">{escala.paciente}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm text-left">{escala.profissional}</td>
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
