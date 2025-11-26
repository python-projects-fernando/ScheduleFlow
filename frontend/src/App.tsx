import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import CalendarAvailability from './components/CalendarAvailability'; 
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import PublicCancellationPage from './pages/PublicCancellationPage';
import AdminSignInPage from './pages/AdminSignInPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminServiceManagementPage from './pages/AdminServiceManagementPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />       
            <Route path="/auth/admin-signin" element={<AdminSignInPage/>}/>   
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute> 
                <AdminDashboardPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <AdminProtectedRoute> 
                <AdminServiceManagementPage />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/appointments" element={
              <AdminProtectedRoute> 
                <AdminAppointmentsPage />
              </AdminProtectedRoute>
            } />
            <Route path="/booking" element={<CalendarAvailability />} />
            <Route path="/booking/my-appointments" element={<MyAppointmentsPage />} />
            <Route path="/booking/appointments-details/:viewToken" element={<AppointmentDetailsPage />} />
            <Route path="/booking/cancel-by-token/:cancellationToken" element={<PublicCancellationPage />} />           
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />          
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;