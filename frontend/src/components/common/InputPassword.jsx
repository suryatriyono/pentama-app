import classNames from 'classnames';
import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const InputPassword = forwardRef(
  (
    {
      name,
      value,
      onChange,
      placeholder = 'Enter Password',
      required = true,
      className = 'bg-[#eee] border-none text-sm rounded-lg w-full outline-none',
      error = null,
      classNameError = 'outline-red-500 outline-1 placeholder:text-red-500',
      classNameOther = null,
    },
    ref
  ) => {
    const [isHidePassword, setIsHidePassword] = useState(true);

    const setHidePassword = () => {
      setIsHidePassword(!isHidePassword);
    };

    return (
      <>
        <div className="w-full relative flex items-center justify-end">
          <input
            ref={ref}
            name={name}
            value={value}
            placeholder={placeholder}
            type={isHidePassword ? 'password' : 'text'}
            onChange={onChange}
            required={required}
            className={classNames(
              'size-11 my-2 px-2 text-lg placeholder:capitalize',
              className,
              error ? classNameError : classNameOther
            )}
            aria-label={placeholder}
          />
          <div
            className="absolute mr-3 cursor-pointer transition-all ease-in-out duration-[0.5s]"
            onClick={setHidePassword}
          >
            {isHidePassword ? (
              <FaEyeSlash className="size-4" />
            ) : (
              <FaEye className="size-4" />
            )}
          </div>
        </div>
        {error && <small className="w-full text-red-600">{error}</small>}
      </>
    );
  }
);

export default InputPassword;
