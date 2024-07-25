// src/services/scheduleService.ts
import api from '@/api';

export interface Schedule {
  Horario: string;
  DataAtendimento: string;
  Paciente: string;
  Profissional: string;
  DiaDaSemana: string;
}

export const getSchedule = async (month: number, year: number, pacienteId: string, clienteId: string): Promise<Schedule[]> => {
  const response = await api.get<Schedule[]>('/api/Escalas', {
    params: { month, year, pacienteId, clienteId }
  });
  return response.data;
};
