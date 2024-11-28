import React from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../../components/features/auth/authSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  dispatch(logout());
  return <div>AdminDashboardPage</div>;
};

export default AdminDashboardPage;
