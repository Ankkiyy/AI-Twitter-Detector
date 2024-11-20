import React from 'react';
import { Link } from 'react-router-dom';
// Import Header and Footer
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
     <Header /> 
    <div className="min-h-screen flex flex-col font-roboto bg-gray-50">
      {/* Header Component */}
     

      {/* Add space between header and main content */}
      <div className="mt-20"></div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12">
        
        {/* Heading and Description */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 tracking-tight">
            Welcome to AI Tweet Analysis
          </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Analyze tweets with cutting-edge AI technology. Whether you're looking to detect sentiment, identify trends, or monitor social media activity, our platform provides powerful tools to gain insights from Twitter data.
            </p>
        </div>

        {/* Buy or Rent Options with Arrows */}
        <div className="flex space-x-4 mb-12">
          
          {/* Explore Ai System Button with Right Arrow */}
          <Link 
            to="/ai" 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-3 px-8 rounded-lg transition duration-300 flex items-center space-x-2 text-lg font-semibold tracking-wide shadow-lg transform hover:scale-105 animate-fadeIn"
            style={{ animationDelay: '0.6s' }}
          >
            <span>Explore This AI</span>
            {/* Right Arrow Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
      {/* Footer Component */}
    </div>
    <Footer />
    </>
  );
};

export default Home;
