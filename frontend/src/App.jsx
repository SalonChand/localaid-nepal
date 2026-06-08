import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/common/Header';
import MobileTopBar from './components/common/MobileTopBar';
import BottomNav from './components/common/BottomNav';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SOSButton from './components/common/SOSButton';
import OfflineSyncManager from './components/common/OfflineSyncManager';
import SplashScreen from './components/common/SplashScreen';

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
      <SplashScreen>
        <BrowserRouter>
          {/* Desktop keeps your existing header; mobile gets the minimal bar */}
          <div className="hidden md:block">
            <Header />
          </div>
          <MobileTopBar />

          {/* GLOBAL COMPONENTS */}
          <OfflineSyncManager />
          <SOSButton />

          {/* pb-24 on mobile leaves room for the fixed bottom nav; reset at md */}
          <main className="min-h-[calc(100vh-64px)] bg-slate-50 pb-24 md:pb-0">
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

          {/* Native-style bottom tab bar (mobile only) */}
          <BottomNav />
        </BrowserRouter>
      </SplashScreen>
    </AuthProvider>
  );
}

export default App;
