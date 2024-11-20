// AboutUs.tsx

import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-24 px-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-teal-600 mb-8">About Us</h1>

          <p className="text-lg text-gray-700 mb-6">
            Welcome to <span className="font-semibold">AI Tweet Detector</span>, your premier platform for advanced tweet analysis and detection. 
            We leverage cutting-edge AI technology to help you understand and manage social media content effectively. 
            Our mission is to provide accurate, insightful, and actionable analysis of tweets to enhance your social media strategy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-4 mb-8">
            <li>
              <strong>Advanced AI Algorithms:</strong> Our platform uses state-of-the-art AI models to analyze tweets, ensuring high accuracy and reliability.
            </li>
            <li>
              <strong>Real-Time Analysis:</strong> Get instant insights and analysis of tweets as they are posted, helping you stay ahead of the curve.
            </li>
            <li>
              <strong>Comprehensive Reports:</strong> Receive detailed reports on tweet sentiment, trends, and more, enabling data-driven decision-making.
            </li>
            <li>
              <strong>User-Friendly Interface:</strong> Our intuitive platform makes it easy to navigate and utilize our tools, even for non-technical users.
            </li>
            <li>
              <strong>Customizable Solutions:</strong> Tailor our services to meet your specific needs, whether you're a small business or a large enterprise.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-4 mb-8">
            <li>
              <strong>Sign Up & Connect:</strong> Create an account and connect your Twitter profile to start analyzing tweets.
            </li>
            <li>
              <strong>Analyze Tweets:</strong> Use our tools to analyze tweets in real-time or in bulk, gaining valuable insights.
            </li>
            <li>
              <strong>Generate Reports:</strong> Create comprehensive reports to understand tweet sentiment, trends, and more.
            </li>
            <li>
              <strong>Take Action:</strong> Use the insights gained to improve your social media strategy and engagement.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Support</h2>
          <p className="text-gray-700 mb-8">
            Need assistance? Our dedicated support team is here to help with any questions or issues, ensuring your experience with us is always positive.
          </p>

          <div className="text-center">
            <p className="text-gray-700">
              Thank you for choosing AI Tweet Detector. Together, let's harness the power of AI to transform your social media presence!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
