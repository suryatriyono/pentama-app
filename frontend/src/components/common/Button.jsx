import React from 'react';

const Button = ({
  type = 'button',
  onClick,
  children,
  id,
  name,
  className = 'bg-purple-800 text-white text-xs py-2.5 px-11 border-solid border border-transparent rounded-lg font-semibold tracking-wider uppercase  hover:bg-purple-600',
}) => {
  return (
    <button
      id={id}
      name={name}
      type={type}
      onClick={onClick}
      className={`mt-5 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
