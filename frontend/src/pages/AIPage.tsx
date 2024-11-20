import React from 'react';
import { Link } from 'react-router-dom';

const AIPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-12">
      {/* Breadcrumb Navigation */}
      <div className="text-sm mb-4">
        <Link to="/" className="text-red-500 hover:underline">Home</Link> › AI Tweet Analysis
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">AI Tweet Analysis</h1>

      {/* AI Tweet Analysis Form */}

      <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="tweet" className="block text-sm font-medium text-gray-700">Tweet</label>
          <textarea id="tweet" name="tweet" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm" required></textarea>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Analyze
          </button>
        </div>
        </form>
    </div>
  );
};

export default AIPage;
