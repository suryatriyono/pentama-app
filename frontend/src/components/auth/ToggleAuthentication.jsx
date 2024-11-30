import React from 'react';
import Button from '../common/Button';

const ToggleAuthentication = ({ isLoginPage, setLoginPage }) => {
  return (
    <div
      className={`absolute top-0 left-[50%] w-1/2 h-full overflow-hidden transition-all duration-[0.6s] z-[1000] drop ${
        !isLoginPage
          ? 'translate-x-[-100%] rounded-tr-[150px] rounded-br-[100px]'
          : 'rounded-tl-[150px] rounded-bl-[100px]'
      }`}
    >
      <div
        className={`bg-purple-900 h-full bg-gradient-to-t from-purple-600 to-indigo-900 text-white relative left-[-100%] w-[200%] translate-x-0 transition-all ease-in-out duration-[0.6s] ${
          !isLoginPage ? 'translate-x-[50%]' : ''
        }`}
      >
        {/* // For Register */}
        <div
          className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 translate-x-[-200%] transition-all ease-in-out duration-[0.6s] ${
            !isLoginPage ? 'translate-x-[0]' : ''
          }`}
        >
          <h1 className="text-4xl font-bold text-white">Welcome Back😎</h1>
          <p className="text-[14px] leading-5 tracking-wider my-5 ">
            Already have an account. Come on, log in now and try your best
          </p>
          <Button
            className="bg-transparent text-white text-xs py-2.5 px-11 border-solid border border-white rounded-lg font-semibold tracking-wider uppercase mt-10 cursor-pointer hover:bg-white hover:text-purple-800 hover:transition-colors hover:duration-[0.5s]"
            id="register"
            onClick={() => setLoginPage()}
          >
            Login
          </Button>
        </div>
        {/* // For Login */}
        <div
          className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 translate-x-0 transition-all ease-in-out duration-[0.6s] right-0 ${
            !isLoginPage ? 'translate-x-[200%]' : ''
          } `}
        >
          <h1 className="text-4xl font-bold">Hello Friend🤚</h1>
          <p className="text-[14px] leading-5 tracking-wider my-5 ">
            Register with your personal details to use all the features of the
            student final project assessment site
          </p>
          <Button
            className="bg-transparent text-white text-xs py-2.5 px-11 border-solid border border-white rounded-lg font-semibold tracking-wider uppercase mt-10 cursor-pointer hover:bg-white hover:text-purple-800 hover:transition-colors hover:duration-[0.5s]"
            id="register"
            onClick={() => setLoginPage()}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToggleAuthentication;
