import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @ts-ignore
import Header from './components/Header';
// @ts-ignore
import Footer from './components/Footer';
// @ts-ignore
import Home from './pages/Home';
// @ts-ignore
import LoginSignup from './Auth/LoginSignup';
// @ts-ignore
import ForgotPassword from './auth/ForgotPassword'; 
// @ts-ignore
import PrivacyPolicy from './pages/PrivacyPolicy';
// @ts-ignore
import TermsAndConditions from './pages/TermsAndConditions';
import HelpCenter from './pages/HelpCenter';
import AboutUs from './pages/AboutUs';
import AIPage from './pages/AIPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  let t=localStorage.getItem('token');

  if(t){
    return children;
  }
  else{
    return <Navigate to="/LoginSignup" />;
  }
}

// Main App component
function App() {


  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/help-center" element={<HelpCenter />} />
      </Routes>
    </div>
  );
}

// Main render
function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;
