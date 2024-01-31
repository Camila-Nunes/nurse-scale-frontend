// components/Button.tsx

import React, { MouseEvent, ChangeEvent } from 'react';
import classNames from 'classnames';

interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  text: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  onChange,
  className,
  disabled,
  text,
}) => {
  const buttonClasses = classNames(
    'py-2 px-4 leading-6 bg-blue-500 text-sm font-semibold text-white rounded',
    className,
    { 'opacity-50 cursor-not-allowed': disabled }
  );

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
