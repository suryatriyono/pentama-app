import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../components/common/Button';
import { logout } from '../../components/features/auth/authSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  console.log(localStorage);

  return (
    <div>
      AdminDashboardPag
      <Button onClick={handleLogout}></Button>
    </div>
  );
};

export default AdminDashboardPage;
