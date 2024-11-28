import { useEffect, useRef, useState } from 'react';
import { PiStudentDuotone } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../components/features/auth/authSlice';
import Button from './common/Button';
import FormContainer from './common/FormContainer';
import InputField from './common/InputField';
import InputPassword from './common/InputPassword';

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
  const { isAuthenticated, error, loading, role } = useSelector(
    (state) => state.auth
  ); // pastikan loading ditarik dari state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; // Menghindari input jika loading sedang aktif
    setErrorFields({ email: null, password: null }); // reset error state
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(`/${role}/dashboard`);
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    if (error) {
      const updatedErrorFields = { email: null, password: null };
      // Memeriksa apakah error ada dan tidak null
      if (error.response.errors && Array.isArray(error.response.errors)) {
        error.response.errors.forEach((err) => {
          if (err.field === 'email') updatedErrorFields.email = err.message;
          if (err.field === 'password')
            updatedErrorFields.password = err.message;
        });
      } else if ([404, 400].includes(error.status)) {
        Swal.fire({
          title: error.response.message,
          icon: 'error',
        }).then((result) => {
          if (error.status === 404) {
            if (result.isConfirmed) {
              setLoginPage();
            }
          }
        });
        if (error.status === 400) passwordRef.current.focus();
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
          disabled={loading}
        >
          {' '}
          {/* Disable tombol jika loading aktif */}
          {loading ? 'Loading...' : 'Login'} {/* Tampilkan teks loading */}
        </Button>
      </FormContainer>
    </div>
  );
};

export default LoginForm;
