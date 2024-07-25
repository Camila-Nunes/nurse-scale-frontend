// src/components/ScheduleTable.tsx
import { Schedule } from '@/services/scheduleService';
import React from 'react';
import Page from './Page';

interface ScheduleTableProps {
  scheduleData: Schedule[];
}

const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const ScheduleTable: React.FC<ScheduleTableProps> = ({ scheduleData }) => {
  const horarios = Array.from(new Set(scheduleData.map(s => s.Horario)));

  const groupedData = horarios.map(horario => {
    const data = scheduleData.filter(s => s.Horario === horario);
    return { horario, data };
  });

  return (
    <Page titulo="Escala do mês">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">Horario</th>
              {Array.from({ length: 7 }).map((_, idx) => (
                <th key={idx} className="py-2 px-4 border-b border-gray-300">{daysOfWeek[idx]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedData.map(({ horario, data }) => (
              <tr key={horario}>
                <td className="py-2 px-4 border-b border-gray-300">{horario}</td>
                {Array.from({ length: 7 }).map((_, idx) => {
                  const dayData = data.find(d => new Date(d.DataAtendimento).getDay() === idx);
                  return (
                    <td key={idx} className="py-2 px-4 border-b border-gray-300">
                      {dayData ? dayData.Profissional : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
    
  );
};

export default ScheduleTable;
