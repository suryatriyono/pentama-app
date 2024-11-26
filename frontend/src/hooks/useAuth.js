import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // check if the decoded token expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({ token, role });
        } else {
          // expired token, remove from local storage
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
        }
      } catch (error) {
        // invalid token, remove from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
      }
    }
  }, []);

  return user;
};

export default useAuth;
