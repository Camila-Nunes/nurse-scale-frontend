// Dropdown.tsx
import React from 'react';

interface DropdownProps {
  options: { text: string; url: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ options }) => {
  return (
    <div className="absolute mt-2 bg-white border rounded shadow-md">
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            <a href={option.url} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
              {option.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
