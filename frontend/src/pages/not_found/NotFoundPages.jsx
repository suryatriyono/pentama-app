import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PotSpilled from '../../assets/images/pot_spilled.png';
import Button from '../../components/common/Button';

const NotFoundPages = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate('/auth');
      return;
    }
  }, [role]);

  return (
    <div className="w-screen h-screen flex justify-center items-center font-popps bg-gradient-to-tl from-indigo-50 to-indigo-300">
      <div className="bg-white min-w-[800px] max-w-full min-h-[550px] relative rounded-3xl overflow-hidden shadow-lg shadow-neutral-600">
        <div className="absolute top-0 h-full transition-all ease-in-out duration-[0.6s] right-0 w-2/4 z-[2] flex justify-center items-center flex-col bg-purple-700 text-white px-8 text-center">
          <h1 className="text-8xl font-bold">404</h1>
          <h2 className="text-2xl capitalize font-semibold">Page not found</h2>
          <p className="text-sm my-5">
            We're sorry, teh page you requested could not be found. Please go
            bacak the Authentication Page{' '}
          </p>
          <Button
            className="bg-transparent text-white text-xs py-2.5 px-11 border-solid border border-white rounded-lg font-semibold tracking-wider uppercase mt-10 cursor-pointer hover:bg-white hover:text-purple-800 hover:transition-colors hover:duration-[0.5s]"
            id="register"
          >
            Back
          </Button>
        </div>
        <div className="absolute left-0 flex justify-center items-center h-full w-2/4">
          <img
            className="w-full"
            src={PotSpilled}
            alt="pot_spilled"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPages;
