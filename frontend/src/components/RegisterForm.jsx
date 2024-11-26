import React, { useEffect, useRef, useState } from 'react';
import { PiStudentDuotone } from 'react-icons/pi';
import { registerUser } from '../services/auth.service';
import Button from './common/Button';
import FormContainer from './common/FormContainer';
import InputField from './common/InputField';
import InputPassword from './common/InputPassword';
import SelectInput from './common/SelectInput';

const RegisterForm = ({ isLoginPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorFields, setErrorFields] = useState({
    email: null,
    password: null,
    confirmPassword: null,
    role: null,
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorFields({
      email: null,
      password: null,
      confrimPassword: null,
      role: null,
    });
    try {
      await registerUser({ email, password, confirmPassword, role });
    } catch (errorResponse) {
      const updatedErrorFields = {
        email: null,
        password: null,
        confirmPassword: null,
        role: null,
      };
      if (
        errorResponse.data.errors &&
        Array.isArray(errorResponse.data.errors)
      ) {
        errorResponse.data.errors.forEach((error) => {
          if (error.field === 'email' && !updatedErrorFields.email) {
            updatedErrorFields.email = error.message;
          } else if (
            error.field === 'password' &&
            !updatedErrorFields.password
          ) {
            updatedErrorFields.password = error.message;
          } else if (
            error.field === 'confirmPassword' &&
            !updatedErrorFields.confirmPassword
          ) {
            updatedErrorFields.confirmPassword = error.message;
          } else if (error.field === 'role' && !updatedErrorFields.role) {
            updatedErrorFields.role = error.message;
          }
        });
        setErrorFields(updatedErrorFields);
      }
      console.error(errorResponse);
    }
  };

  useEffect(() => {
    if (errorFields.email && emailRef.current) {
      emailRef.current.focus();
    } else if (errorFields.password && passwordRef.current) {
      passwordRef.current.focus();
    } else if (errorFields.confirmPassword && confirmPasswordRef.current) {
      confirmPasswordRef.current.focus();
    }
  }, [errorFields]);

  return (
    <div
      className={`absolute top-0 h-full transition-all ease-in-out duration-[0.6s] left-0 w-[50%] opacity-0 z-1 ${
        !isLoginPage ? 'translate-x-[100%] opacity-100 z-[5] animate-move' : ''
      }`}
    >
      <FormContainer onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold">Create Account</h1>
        <h2 className="flex flex-row text-lg font-semibold mt-3">
          <PiStudentDuotone />
          PEN<span className="text-purple-800">TAMA</span>
        </h2>
        <h3 className="mb-3">
          <span className="text-purple-800">Penilaian Tugas</span> Akhir
          Mahasiswa
        </h3>
        <p>Buruan daftar...</p>
        <InputField
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailRef}
          error={errorFields.email}
        />
        <InputPassword
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
          error={errorFields.password}
        />
        <InputPassword
          name="confirmPassword"
          placeholder="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          ref={confirmPasswordRef}
          error={errorFields.confirmPassword}
        />
        <SelectInput
          id="role"
          name="role"
          placeholder="select role"
          options={['lecturer', 'student']}
          value={role}
          setSelectedOption={setRole}
          error={errorFields.role}
        />
        <Button
          type="submit"
          id="register"
          name="register"
        >
          Register
        </Button>
      </FormContainer>
    </div>
  );
};

export default RegisterForm;
