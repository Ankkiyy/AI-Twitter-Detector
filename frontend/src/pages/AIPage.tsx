import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AIPage: React.FC = () => {
  const [tweet, setTweet] = React.useState<string>('');
  const [prediction, setPrediction] = React.useState<string>('');
  const [subPrediction, setSubPrediction] = React.useState<string>('');

  const handleTweetChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrediction('');
    setSubPrediction('');
    setTweet(event.target.value);
  };

  const handleAnalyze = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:10007/api/v1/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data?.prediction) 
          setPrediction(data!.prediction);

        if (data?.sub_prediction)
          setSubPrediction(data!.sub_prediction)

        console.log(data);
      } else {
        console.error('Failed to analyze tweet');
      }
    } catch (error) {
      console.error('Failed to analyze tweet');
    }
  };

  return (
    <>
    <Header />
    <div className="py-20 px-20 bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="p-2 text-sm mb-4">
        <Link to="/" className="text-red-500 hover:underline">Home</Link> › AI Tweet Analysis
      </div>

      <h1 className="p-2 text-4xl font-bold text-gray-800 mb-8 text-center">AI Tweet Analysis</h1>

      {/* AI Tweet Analysis Form */}

      <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="tweet" className="block text-sm font-medium text-gray-700">Tweet</label>
          <textarea id="tweet"
          maxLength={4900}
            value={tweet}
            onChange={handleTweetChange}
          name="tweet" rows={4} className="mt-1 block p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm" required></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="prediction" className="block text-sm font-medium text-gray-700">Prediction</label>
          <span id="prediction"
            className="mt-1 block p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm">
            {prediction + ' '}
            {prediction == "Hostile" ? "(" + subPrediction + ")" : "" }
            </span>
        </div>

        <div className="flex justify-center">
          <button
          onClick={handleAnalyze}
          type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Analyze
          </button>
        </div>
        </form>
    </div>
    <Footer />
    </>
  );
};

export default AIPage;
