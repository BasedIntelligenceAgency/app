import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TweetAnalysis } from '../types';

export default function ResultsPage() {
  const [result, setResult] = useState<TweetAnalysis | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const resultStr = localStorage.getItem('analysis_result');
    const username = localStorage.getItem('twitter_username');
    if (!resultStr || !username) {
      navigate('/');
      return;
    }

    try {
      const data = JSON.parse(resultStr);
      setResult(data);
    } catch (error) {
      console.error('Failed to parse results:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleReset = () => {
    localStorage.removeItem('twitter_token');
    localStorage.removeItem('twitter_username');
    localStorage.removeItem('analysis_result');
    navigate('/');
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-lg text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Extract the actual analysis from the explanation
  const getAnalysis = (explanation: string) => {
    // Try to find content after "Analysis:" or similar markers
    const analysisMatch = explanation.match(/(?:Analysis:|Summary:|Conclusion:)(.*?)(?:\*\*|$)/is);
    if (analysisMatch?.[1]) {
      return analysisMatch[1].trim();
    }

    // Try to find content between asterisks that looks like analysis
    const asteriskMatch = explanation.match(/\*\*(.*?)\*\*/);
    if (asteriskMatch?.[1]) {
      return asteriskMatch[1].trim();
    }

    // If no markers found, try to find a meaningful sentence
    const sentences = explanation.split(/[.!?]+\s+/);
    const meaningfulSentence = sentences.find(s => 
      s.toLowerCase().includes('appears to be') || 
      s.toLowerCase().includes('seems to be') ||
      s.toLowerCase().includes('indicates') ||
      s.toLowerCase().includes('suggests') ||
      s.toLowerCase().includes('shows')
    );
    if (meaningfulSentence) {
      return meaningfulSentence.trim() + '.';
    }

    // Fallback: return a portion that doesn't include the setup text
    const withoutSetup = explanation.replace(/^.*?(?:let's|we can|I will|I'll)\s+\w+\s+this\s*:?/i, '');
    return withoutSetup.split(/[.!?]+\s+/)[0].trim() + '.';
  };

  const shortExplanation = getAnalysis(result.explanation);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8">based or biased?</h1>
        <p className="text-center text-gray-600 mb-6">the results are in!</p>
        
        <div className="border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Twitter Handle */}
          <div className="flex items-center space-x-3">
            <img 
              src={`https://unavatar.io/twitter/${localStorage.getItem('twitter_username')}`}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-lg">@{localStorage.getItem('twitter_username')}</span>
          </div>

          {/* Wojak Image */}
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/greywojack.png"
              alt="Wojak"
              className="w-48 h-48"
            />
          </div>

          {/* Tribe */}
          <div className="text-center">
            <p className="text-gray-600 mb-1">Tribe</p>
            <h2 className="text-2xl font-bold">{result.tribe}</h2>
          </div>

          {/* Based Score */}
          <div className="bg-green-200 rounded-lg p-3 text-center">
            <p className="text-gray-700">Your based score</p>
            <p className="text-3xl font-bold">{result.basedScore}/100</p>
          </div>
        </div>

        {/* Domain */}
        <p className="text-center text-gray-400 mt-4">based-or-biased.com</p>

        {/* Short Explanation */}
        {shortExplanation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm italic text-center">
              "{shortExplanation}"
            </p>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
} 