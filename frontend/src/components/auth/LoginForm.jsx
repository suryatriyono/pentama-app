import { useEffect, useRef, useState } from 'react';
import { PiStudentDuotone } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '../common/Button';
import FormContainer from '../common/FormContainer';
import InputField from '../common/InputField';
import InputPassword from '../common/InputPassword';
import { login } from '../features/auth/authSlice';

const LoginForm = ({ isLoginPage, setLoginPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorFields, setErrorFields] = useState({
    email: null,
    password: null,
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, error, isLoading } = useSelector(
    (state) => state.auth
  ); // pastikan isLoading ditarik dari state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return; // Menghindari input jika isLoading sedang aktif
    setErrorFields({ email: null, password: null }); // reset error state
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(`/${role}/dashboard`);
    }
  }, [isAuthenticated, role, navigate]);

  console.log(localStorage);

  useEffect(() => {
    if (error) {
      const updatedErrorFields = { email: null, password: null };
      // Memeriksa apakah error ada dan tidak null
      if (error.data.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err) => {
          if (err.field === 'email') {
            updatedErrorFields.email = err.message;
          }
          if (err.field === 'password') {
            updatedErrorFields.password = err.message;
          }
        });
      } else if ([404, 400].includes(error.status)) {
        Swal.fire({
          title: error.data.message,
          icon: 'error',
        }).then((result) => {
          if (error.status === 404) {
            if (result.isConfirmed) {
              setLoginPage();
            }
          }
        });
        if (error.status === 400) {
          updatedErrorFields.password = error.data.message;
          passwordRef.current.focus();
        }
      }
      setErrorFields(updatedErrorFields);
    }
  }, [error]);

  useEffect(() => {
    if (errorFields.email) {
      emailRef.current.focus();
    } else if (errorFields.password) {
      passwordRef.current.focus();
    }
  }, [errorFields]);

  return (
    <div
      className={`absolute top-0 h-full left-0 w-[50%] z-[2] transition-all duration-[0.6s] ${
        !isLoginPage ? 'translate-x-[100%] animate-move' : ''
      }`}
    >
      <FormContainer
        onSubmit={handleSubmit}
        className="bg-white flex items-center justify-center flex-col px-10 h-full"
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
          disabled={isLoading}
        >
          {' '}
          {/* Disable tombol jika isLoading aktif */}
          {isLoading ? 'Loading...' : 'Login'} {/* Tampilkan teks isLoading */}
        </Button>
      </FormContainer>
    </div>
  );
};

export default LoginForm;
