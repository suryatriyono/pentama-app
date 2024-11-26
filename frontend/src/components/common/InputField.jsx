import classNames from 'classnames';
import React, { forwardRef } from 'react';

const InputField = forwardRef(
  (
    {
      type = 'text',
      name,
      value,
      onChange,
      placeholder,
      required = true,
      className = 'bg-[#eee] border-none outline-none  text-sm rounded-lg w-full relative',
      error = null,
      classNameError = 'outline-red-500 outline-1 placeholder:text-red-500',
      classNameOther = null,
    },
    ref
  ) => {
    return (
      <>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          required={required}
          className={classNames(
            'size-11 px-2 my-2 placeholder:capitalize',
            className,
            error ? classNameError : classNameOther
          )}
          aria-label={placeholder}
        />
        {error && <small className="w-full text-red-600">{error}</small>}
      </>
    );
  }
);

export default InputField;
