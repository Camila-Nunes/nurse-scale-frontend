// components/AnoSelect.tsx
import { useState } from 'react';

interface AnoSelectProps {
  onSelectYear: (year: number) => void;
}

const AnoSelect: React.FC<AnoSelectProps> = ({ onSelectYear }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const years = Array.from({ length: 6 }, (_, index) => currentYear - index);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(event.target.value, 10);
    setSelectedYear(selected);
    onSelectYear(selected);
  };

  return (
    <select
      value={selectedYear}
      onChange={handleChange}
      className="p-2 font-semibold border-gray-300 block w-36 rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
        {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default AnoSelect;
