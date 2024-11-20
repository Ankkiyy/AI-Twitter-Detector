import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap">
        
          {/* Left: Logo and Social Media Icons */}
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            {/* Replace with your actual logo */}
         

            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="https://download.logo.wine/logo/Twitter/Twitter-Logo.wine.png" alt="Twitter" className="h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="h-6" />
              </a>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="text-center mb-6 lg:mb-0">
            <div className="flex justify-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
              <Link to="/AboutUs" className="text-gray-600 hover:text-gray-800">About Us</Link>
              <Link to="/privacy-policy" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="text-gray-600 hover:text-gray-800">Terms and Conditions</Link>
            </div>
          </div>

          {/* Right: Help Center Button */}
          <div className="text-center lg:text-right mb-6 lg:mb-0">
            <a href="/help-center" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full">
              Help Center
            </a>
          </div>
        </div>

       

        {/* App Store and Play Store Icons */}
        <div className="flex justify-center space-x-4 mt-6">
          <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play Store" className="h-10" />
          </a>
          <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.worldvectorlogo.com/logos/available-on-the-app-store.svg" alt="Apple App Store" className="h-10" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
