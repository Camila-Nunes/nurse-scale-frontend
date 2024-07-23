import React, { useState, useEffect } from 'react';

interface FiltroDiaProps {
  onChange: (selectedDay: number) => void;
}

const FiltroDia: React.FC<FiltroDiaProps> = ({ onChange }) => {
  // Cria um array de 1 a 31
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  // Estado para o dia selecionado
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Atualiza o estado com o dia corrente
  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    setSelectedDay(currentDay);
    onChange(currentDay);
  }, [onChange]);

  // Atualiza o estado e notifica o componente pai quando o dia selecionado muda
  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const day = parseInt(event.target.value, 10);
    setSelectedDay(day);
    onChange(day);
  };

  return (
    <select
      value={selectedDay}
      onChange={handleDayChange}
      className="p-2 font-semibold border-gray-300 block w-36 rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6"
    >
      {dias.map((dia) => (
        <option key={dia} value={dia}>
          {dia}
        </option>
      ))}
    </select>
  );
};

export default FiltroDia;
