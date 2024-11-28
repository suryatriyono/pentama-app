import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';
import ToggleAuthentication from '../../components/ToggleAuthentication';

const AuthenticationPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  const setLoginPage = () => {
    setIsLoginPage((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center font-popps bg-gradient-to-tl from-indigo-50 to-indigo-300">
      <div className="bg-white min-w-[800px] max-w-full min-h-[550px] relative rounded-3xl overflow-hidden shadow-lg shadow-neutral-600">
        {/* Login panel */}
        <LoginForm
          isLoginPage={isLoginPage}
          setLoginPage={setLoginPage}
        />
        {/* Register panel */}
        <RegisterForm />
        {/* Toggle Authentication Panel */}
        <ToggleAuthentication
          isLoginPage={isLoginPage}
          setLoginPage={setLoginPage}
        />
      </div>
    </div>
  );
};

export default AuthenticationPage;
