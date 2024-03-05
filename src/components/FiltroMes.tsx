import React, { useState, useEffect } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { format } from 'date-fns';

interface FiltroMesProps {
  meses: string[];
  onChange: (selectedMonth: string, monthIndex: number) => void;
}

const FiltroMes: React.FC<FiltroMesProps> = ({ meses, onChange }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(meses[currentDate.getMonth()] || '');

  useEffect(() => {
    const monthIndex = meses.indexOf(selectedMonth) + 1;
    onChange(selectedMonth, monthIndex);
  }, [meses, onChange, selectedMonth]);

  const handleMonthChange = (newSelectedMonth: string) => {
    setSelectedMonth(newSelectedMonth);
  };

  const handlePrevMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currentIndex = meses.indexOf(selectedMonth);
    const newIndex = (currentIndex - 1 + meses.length) % meses.length;
    handleMonthChange(meses[newIndex]);
  };

  const handleNextMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const currentIndex = meses.indexOf(selectedMonth);
    const newIndex = (currentIndex + 1) % meses.length;
    handleMonthChange(meses[newIndex]);
  };

  return (
    <div className="w-full flex items-center justify-end space-x-4">
      <button onClick={handlePrevMonth}>
        <AiFillCaretLeft className="w-6 h-6" />
      </button>
      <div>
        <p className="text-lg font-semibold">
          {selectedMonth}
        </p>
      </div>
      <button onClick={handleNextMonth}>
        <AiFillCaretRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FiltroMes;
