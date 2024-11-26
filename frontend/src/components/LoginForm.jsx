import React, { useEffect, useRef, useState } from 'react';
import { PiStudentDuotone } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../components/features/auth/authSlice';
import Button from './common/Button';
import FormContainer from './common/FormContainer';
import InputField from './common/InputField';
import InputPassword from './common/InputPassword';

const LoginForm = ({ isLoginPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorFields, setErrorFields] = useState({
    email: null,
    password: null,
  });
  // Reference to email and password fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { isAuthenticated, user, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorFields({ email: null, password: null }); // reset errors state
    dispatch(login({ email, password }));
  };

  // Handle when login process is fullfilled
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user]);
  // Handle when a login promise is rejected
  useEffect(() => {
    if (error) {
      console.log(error);
      const updatedErrorFields = { email: null, password: null };
      if (error.data.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err) => {
          if (err.field === 'email' && !updatedErrorFields.email) {
            updatedErrorFields.email = err.message;
          } else if (err.field === 'password' && !updatedErrorFields.password) {
            updatedErrorFields.password = err.message;
          }
          setErrorFields((prev) => ({ ...prev, ...updatedErrorFields }));
        });
      } else if (error.status === 404) {
        Swal.fire({
          title: error.data.message,
          icon: 'error',
        });
      } else if (error.status === 400) {
        updatedErrorFields.password = error.data.message;
        Swal.fire({
          title: error.data.message,
          icon: 'error',
        });
        setErrorFields((prev) => ({ ...prev, ...updatedErrorFields }));
        passwordRef.current.focus();
      }
    }
  }, [error]);

  // Focus on the first error field when the form is submitted
  useEffect(() => {
    if (errorFields.email) {
      emailRef.current.focus();
    } else if (errorFields.password) {
      passwordRef.current.focus();
    }
  }, [errorFields]);

  return (
    <div
      className={`absolute top-0 h-full transition-all ease-in-out duration-[0.6s] left-0 w-[50%] z-[2] ${
        !isLoginPage ? 'translate-x-[100%] animate-move' : ''
      }`}
    >
      <FormContainer
        onSubmit={handleSubmit}
        className={`bg-white flex items-center justify-center flex-col px-10 h-full`}
      >
        <h1 className="text-4xl font-bold uppercase">Login</h1>
        <h2 className="uppercase flex flex-row text-lg mt-3 font-semibold">
          <PiStudentDuotone />
          Pen<span className="text-purple-800">Tama</span>
        </h2>
        <h3 className="mb-12">
          <span className="text-purple-800">Penilaian Tugas</span> Akhir
          Mahasiswa
        </h3>
        <p>Yuk login...</p>
        <InputField
          placeholder="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailRef}
          error={errorFields.email}
        />
        <InputPassword
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
          error={errorFields.password}
        />
        <Button
          type="submit"
          id="login"
          name="login"
        >
          Login
        </Button>
      </FormContainer>
    </div>
  );
};

export default LoginForm;
