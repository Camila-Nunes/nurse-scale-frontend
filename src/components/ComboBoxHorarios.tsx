import api from '@/api';
import React, { useEffect, useState } from 'react';

interface ComboBoxHorariosProps {
    onSelectHorario: (id: string) => void;
}

const ComboBoxHorarios: React.FC<ComboBoxHorariosProps> = ({ onSelectHorario }) => {
    const [horarios, setHorarios] = useState<{ HorarioId: string, Descricao: string }[]>([]);

    const fetchHorarios = async () => {
      try {
          const response = await api.get('/api/Horarios/todos-horarios');
          return response.data;
      } catch (error) {
          console.error('Error fetching horarios:', error);
          return [];
      }
  };

    useEffect(() => {
        const loadHorarios = async () => {
            const data = await fetchHorarios();
            setHorarios(data);
        };

        loadHorarios();
    }, []);

    return (
        <select
            onChange={(e) => onSelectHorario(e.target.value)}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        >
            <option value="">Selecione um horário</option>
            {horarios.map(horario => (
                <option key={horario.HorarioId} value={horario.HorarioId}>
                    {horario.Descricao}
                </option>
            ))}
        </select>
    );
};

export default ComboBoxHorarios;
