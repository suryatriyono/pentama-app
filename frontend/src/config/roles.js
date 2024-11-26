import { lazy } from 'react';

// load all required components
const AdminDashboardPage = lazy(() =>
  import('../pages/admin/AdminDashboardPage')
);
const LecturerDashboardPage = lazy(() =>
  import('../pages/lecturer/LecturerDashBoardPage')
);
const StudentDashboardPage = lazy(() =>
  import('../pages/student/StudentDashboardPage')
);
const routes = {
  // Admin routes
  admin: [{ path: 'dashboard', component: AdminDashboardPage }],
  // Lecturer routes
  lecturer: [{ path: 'dashboard', component: LecturerDashboardPage }],
  // Student routes
  student: [{ path: 'dashboard', component: StudentDashboardPage }],
};

export default routes;
