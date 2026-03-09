import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import BackupService from './utils/backupService';
import Layout from './components/Layout';
import Login from './components/Login';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import CRM from './pages/CRM';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Info from './pages/Info';
import Settings from './pages/Settings';

function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Inicializar backups automáticos cuando el usuario esté autenticado
    if (isAuthenticated) {
      BackupService.initializeAutoBackup();
    }
    
    // Cleanup al desmontar
    return () => {
      BackupService.stopAutoBackup();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/sales" replace />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="crm" element={<CRM />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="info" element={<Info />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/sales" replace />} />
      </Routes>
    </Router>
  );
}

export default App;