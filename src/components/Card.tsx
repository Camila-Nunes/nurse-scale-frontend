// components/Card.tsx
import React from 'react';
import { IconType } from 'react-icons'; // Importar o tipo IconType
import { FaMoneyBillAlt } from 'react-icons/fa'; // Substituir pelo ícone desejado

interface CardProps {
  title: string;
  value: number;
  color: string;
  quantity?: number; // Tornando a propriedade quantity opcional
  icon?: IconType; // Propriedade de ícone
}

const Card: React.FC<CardProps> = ({ title, value, color, quantity, icon: Icon = FaMoneyBillAlt }) => {

  const displayValue = (value: any) => {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  
    return `${formattedValue}`;
  };

  const displayQuantity = String(quantity ?? '00').padStart(2, '0');

  return (
    <div className={`${color} p-4 m-2 rounded-md py-10 px-10 text-right text-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        {Icon && <Icon className="text-5xl" />}
        <h3 className="text-2xl font-bold mb-1 border-b">{title}</h3>
      </div>
      <p className="text-xl font-semibold mb-1">{displayValue(value)}</p>
      {quantity !== undefined && <p className="text-xl font-semibold">{displayQuantity} </p>}
    </div>
  );
};

export default Card;


