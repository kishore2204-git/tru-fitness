import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import Plans from './pages/Plans';
import CheckIn from './pages/CheckIn';
import Payments from './pages/Payments';
import PortalHome from './pages/portal/PortalHome';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Unified landing page for all login types */}
            <Route path="/login" element={<Landing />} />
            <Route path="/portal/login" element={<Landing />} />
            <Route path="/portal/register" element={<Landing />} />

            {/* Staff / Admin protected area */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="members/:id" element={<MemberDetail />} />
              <Route path="plans" element={<Plans />} />
              <Route path="checkin" element={<CheckIn />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            {/* Member portal */}
            <Route path="/portal/home" element={<PortalHome />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
