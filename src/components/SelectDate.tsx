import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FiltroDataProps {
  onDateChange: (date: { dia: number; mes: number; ano: number }) => void;
}

const FiltroData: React.FC<FiltroDataProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const dia = date.getDate();
      const mes = date.getMonth() + 1; // Janeiro é 0
      const ano = date.getFullYear();
      onDateChange({ dia, mes, ano });
    }
  };

  return (
    <div className="sm:col-span-1">
      <label htmlFor="dataAtendimento" className="block text-sm font-medium leading-6 text-gray-900">
        Data Atendimento
      </label>
      <div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="font-bold block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholderText="Selecione uma data"
        />
      </div>
    </div>
  );
};

export default FiltroData;
