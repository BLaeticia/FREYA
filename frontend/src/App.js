import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import './index.css';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSearchPage from './pages/doctor/DoctorSearchPage';
import DoctorMessages from './pages/doctor/DoctorMessages';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import PatientMessages from './pages/patient/PatientMessages';
import PatientDossier from './pages/patient/PatientDossier';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientProfile from './pages/patient/PatientProfile';
import PatientFavoris from './pages/patient/PatientFavoris';


import {
  PatientDashboard,
  DoctorAppointments, DoctorPatients, DoctorProfile, DoctorAvailability,
  AdminClinics
} from './pages/stubs';

const DoctorProfilePage = () => <div style={{ padding:'40px', textAlign:'center' }}><h2>Profil médecin</h2></div>;
const BookingPage = () => <div style={{ padding:'40px', textAlign:'center' }}><h2>Réservation</h2></div>;

// Guards
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctors" element={<DoctorSearchPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/book/:doctorId" element={<BookingPage />} />

        {/* Patient */}
        <Route path="/patient" element={<PrivateRoute roles={['patient']}><PatientDashboard /></PrivateRoute>} />
        <Route path="/patient/appointments" element={<PrivateRoute roles={['patient']}><PatientAppointments /></PrivateRoute>} />
        <Route path="/patient/messages" element={<PrivateRoute roles={['patient']}><PatientMessages /></PrivateRoute>} />
        <Route path="/patient/dossier" element={<PrivateRoute roles={['patient']}><PatientDossier /></PrivateRoute>} />
        <Route path="/patient/profile" element={<PrivateRoute roles={['patient']}><PatientProfile /></PrivateRoute>} />

        {/* Doctor */}
        <Route path="/doctor" element={<PrivateRoute roles={['doctor']}><DoctorDashboard /></PrivateRoute>} />
        <Route path="/doctor/appointments" element={<PrivateRoute roles={['doctor']}><DoctorAppointments /></PrivateRoute>} />
        <Route path="/doctor/messages" element={<PrivateRoute roles={['doctor']}><DoctorMessages /></PrivateRoute>} />
        <Route path="/doctor/patients" element={<PrivateRoute roles={['doctor']}><DoctorPatients /></PrivateRoute>} />
        <Route path="/doctor/profile" element={<PrivateRoute roles={['doctor']}><DoctorProfile /></PrivateRoute>} />
        <Route path="/doctor/availability" element={<PrivateRoute roles={['doctor']}><DoctorAvailability /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/doctors" element={<PrivateRoute roles={['admin']}><AdminDoctors /></PrivateRoute>} />
        <Route path="/admin/clinics" element={<PrivateRoute roles={['admin']}><AdminClinics /></PrivateRoute>} />
         <Route path="/patient/favoris" element={<PrivateRoute roles={['patient']}><PatientFavoris /></PrivateRoute>} />
         
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
