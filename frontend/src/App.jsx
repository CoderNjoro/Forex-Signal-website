import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SignalProvider } from './context/SignalContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Signals from './pages/Signals';
import SignalDetails from './components/signals/SignalDetails';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import SuperAdmin from './pages/SuperAdmin';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Promotions from './components/signals/Promotions';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <SignalProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/signals"
                    element={
                      <ProtectedRoute>
                        <Signals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/signals/:id"
                    element={
                      <ProtectedRoute>
                        <SignalDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin"
                    element={
                      <ProtectedRoute superAdminOnly={true}>
                        <SuperAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription"
                    element={
                      <ProtectedRoute>
                        <Subscription />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/promotions"
                    element={
                      <ProtectedRoute>
                        <Promotions />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'dark:bg-gray-800 dark:text-white',
                }}
              />
            </div>
          </SignalProvider>
        </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;


