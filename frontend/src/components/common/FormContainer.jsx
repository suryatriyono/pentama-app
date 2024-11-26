import React from 'react';

const FormContainer = ({
  onSubmit,
  children,
  className = 'bg-white flex items-center justify-center flex-col px-10 h-full',
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
    >
      {children}
    </form>
  );
};

export default FormContainer;
