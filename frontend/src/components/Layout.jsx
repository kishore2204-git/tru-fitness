import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, p: 3, overflow: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
