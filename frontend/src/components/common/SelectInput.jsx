import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const SelectInput = ({
  placeholder = 'Select your option',
  options = ['Milky', 'Honey'],
  value,
  onChange,
  error,
  setSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <>
      <div className="w-full relative">
        {/* Dropdown Header */}
        <div
          className={`flex items-center rounded-lg cursor-pointer bg-gray-200 h-11 px-2 my-2 justify-between ${
            error ? 'border border-red-600' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="capitalize">{value || placeholder}</span>
          {!isOpen && <IoIosArrowDown className="text-lg" />}
          {isOpen && <IoIosArrowUp className="text-lg" />}
        </div>

        {/* Dropdown Options with Transition */}
        <ul
          className={`absolute left-0 w-full bg-gray-200 mt-1 rounded-lg px-2 py-2 transition-all duration-300 ease-in-out shadow-md shadow-indigo-600 ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="cursor-pointer py-1 px-2 hover:bg-purple-600 hover:text-white rounded capitalize"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
      {error && <small className="w-full text-red-600">{error}</small>}
    </>
  );
};

export default SelectInput;
