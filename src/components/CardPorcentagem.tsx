// components/Card.tsx
import React from 'react';
import { IconType } from 'react-icons'; // Importar o tipo IconType
import { FaMoneyBillAlt } from 'react-icons/fa'; // Substituir pelo ícone desejado

interface CardPorcentagemProps {
  title: string;
  value?: number;
  color: string;
  icon?: IconType; // Propriedade de ícone
}

const CardPorcentagem: React.FC<CardPorcentagemProps> = ({ title, value, color, icon: Icon = FaMoneyBillAlt }) => {

  const displayValue = (value: any) => {
    // Verificar se o valor é numérico
    if (typeof value === 'number') {
      // Formatar o valor como porcentagem com duas casas decimais
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value / 100); // Divida por 100 para converter para porcentagem
    
      return formattedValue;
    } else {
      return ''; // Se não for numérico, retorna uma string vazia
    }
  };

  return (
    <div className={`${color} p-4 m-2 rounded-md py-10 px-10 text-right text-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        {Icon && <Icon className="text-4xl" />}
        <h3 className="text-2xl font-bold mb-1 border-b">{title}</h3>
      </div>
      {value !== undefined && <p className="text-xl font-semibold mb-1">{displayValue(value)}</p>}
    </div>
  );
};

export default CardPorcentagem;


