import React, { FormEvent } from 'react';

interface BotoesProps {
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const Botoes: React.FC<BotoesProps> = ({ onCancel, onSubmit }) => {
  return (
    <div className="mt-6 flex items-center justify-end gap-x-2">
      <button 
        type="button" 
        onClick={onCancel} 
        className="text-sm py-2 px-4 font-semibold leading-6 bg-transparent hover:bg-red-700 text-red-700 hover:text-white border border-red-700 hover:border-transparent rounded-md"
      >
        Cancelar
      </button>
      <button 
        type="submit" 
        onClick={onSubmit} 
        className="text-sm py-3 px-8 font-semibold leading-6 text-white bg-teal-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Salvar
      </button>
    </div>
  );
}

export default Botoes;
