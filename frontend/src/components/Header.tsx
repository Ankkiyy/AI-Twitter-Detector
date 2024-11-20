import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  let token = localStorage.getItem('token');

  if(token){
    return (
      <header className="bg-white shadow-md py-3 fixed top-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-teal-600 tracking-wide">
              AI Tweet Analysis
            </Link>
          </div>

          {/* Logout Button */}
          <div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                window.location.href = '/';
              }}
              className="bg-red-600 text-white py-2 px-5 rounded-lg transition duration-300 hover:bg-red-500 font-medium text-lg shadow-md">
              Logout
            </button>
          </div>
        </div>
      </header>
    );
  }


  return (
    <header className="bg-white shadow-md py-3 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-bold text-teal-600 tracking-wide">
            AI Tweet Analysis
          </Link>
        </div>

        {/* Login and Sign Up Buttons */}
        <div className="flex space-x-4">
          {/* Login Button: Links to /LoginSignup with ?mode=login */}
          <Link
            to="/LoginSignup" 
            className="text-teal-600 border border-teal-600 py-2 px-5 rounded-lg transition duration-300 hover:bg-teal-600 hover:text-white font-medium text-lg shadow-sm">
            Login
          </Link>

          {/* Sign Up Button: Links to /LoginSignup with ?mode=signup */}
          <Link
            to="/LoginSignup?mode=signup" 
            className="bg-teal-600 text-white py-2 px-5 rounded-lg transition duration-300 hover:bg-teal-500 font-medium text-lg shadow-md">
            Sign Up
          </Link>
        
        </div>
      </div>
    </header>
  );
};

export default Header;
