import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; email?: string; otp?: string }>({});
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const navigate = useNavigate();

  // Strong password validation
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    // Send OTP request to backend
    try {
      let response = await fetch("http://localhost:10007/api/v1/mail/send-otp", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      let data = await response.json();
      if (response.ok) {
        setStep('verify');
        setMessage('OTP has been sent to your email.');
      }
      else {
        setMessage(data!.detail || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    // Verify OTP
    try {
      let response = await fetch("http://localhost:10007/api/v1/mail/verify-otp", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });
      let data = await response.json();
      if (response.ok) {
        setStep('reset');
        setMessage('OTP verified! You can reset your password.');
      } else {
        setMessage(data.detail || 'Invalid OTP');
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!validatePassword(newPassword)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Send request to reset the password
      try {
        let response = await fetch("http://127.0.0.1:10007/api/v1/auth/user/change-password", {
          method: "POST",
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password: newPassword,
            confirm_password: confirmPassword
          })
        });

        let data = await response.text();
        if (response.ok) {
          setMessage('Your password has been updated successfully.');
          setNewPassword('');
          setConfirmPassword('');
          setStep('request');

          setTimeout(() => navigate('/LoginSignup?mode=login'), 2000);
        } else {
          setMessage(data || 'Password reset failed. Please try again.');
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
    
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 'request' ? 'Forgot Password' : step === 'verify' ? 'Verify OTP' : 'Reset Your Password'}
        </h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        {step === 'request' ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 transition duration-300"
            >
              Send OTP
            </button>
          </form>
        ) : step === 'verify' ? (
          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                required
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 transition duration-300"
            >
              Verify OTP
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleResetSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 transition duration-300"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;