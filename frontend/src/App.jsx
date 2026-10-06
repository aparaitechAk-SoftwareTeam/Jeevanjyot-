import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import TreatmentsPage from "./pages/TreatmentsPage";
import PanchakarmaPage from "./pages/PanchakarmaPage";
import DoctorPage from "./pages/DoctorPage";
import KnowledgeCenterPage from "./pages/KnowledgeCenterPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import PatientLogin from "./pages/PatientLogin";
import PatientPortal from "./pages/PatientPortal";

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("jeevanjyot_admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function PatientProtectedRoute({ children }) {
  const token = localStorage.getItem("jeevanjyot_patient_token");

  if (!token) {
    return <Navigate to="/patient/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website Multi-Page Routes with Shared Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/panchakarma" element={<PanchakarmaPage />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
        </Route>

        {/* Admin Public & Protected Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route
          path="/patient/portal"
          element={
            <PatientProtectedRoute>
              <PatientPortal />
            </PatientProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
