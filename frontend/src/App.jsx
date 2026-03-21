import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/common/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SOSButton from './components/common/SOSButton';
import OfflineSyncManager from './components/common/OfflineSyncManager'; // ADDED THIS

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import AvailableTasks from './pages/AvailableTasks';
import MyTasks from './pages/MyTasks';
import Organizations from './pages/Organizations';
import CreateEvent from './pages/CreateEvent';
import Events from './pages/Events';
import CreateOrganization from './pages/CreateOrganization';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        
        {/* GLOBAL COMPONENTS */}
        <OfflineSyncManager />
        <SOSButton />
        
        <main className="min-h-[calc(100vh-64px)] bg-slate-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/events" element={<Events />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/create-request" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><AvailableTasks /></ProtectedRoute>} />
            <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/register-organization" element={<ProtectedRoute><CreateOrganization /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;