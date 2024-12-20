import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeTweets } from '../lib/api';

const messages = [
  "analyzing political views...",
  "calculating based score...",
  "measuring chad energy...",
  "evaluating tribal affiliations...",
  "determining NPC resistance...",
  "quantifying redpill levels...",
  "finalizing chad analysis..."
];

export default function AnalyzingPage() {
  const [error, setError] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);
  const navigate = useNavigate();

  // Cycle through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    const timeoutTimer = setTimeout(() => {
      setShowTimeout(true);
    }, 30000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timeoutTimer);
    };
  }, []);

  const analyze = useCallback(async () => {
    try {
      // Get access token from storage
      const accessToken = localStorage.getItem('twitter_token');
      const username = localStorage.getItem('twitter_username');

      if (!accessToken || !username) {
        throw new Error('Not logged in');
      }

      // Analyze tweets
      const result = await analyzeTweets(accessToken);

      // Store results and navigate
      localStorage.setItem('analysis_result', JSON.stringify(result));
      navigate('/results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      
      // Clear tokens if unauthorized
      if (error instanceof Error && error.message.includes('unauthorized')) {
        localStorage.removeItem('twitter_token');
        localStorage.removeItem('twitter_username');
      }

      // Navigate back to login after a delay
      setTimeout(() => navigate('/'), 3000);
    }
  }, [navigate]);

  useEffect(() => {
    analyze();
  }, [analyze]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-lg text-gray-600">Error: {error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 bg-gray-50">
      <div className="text-center space-y-8">
        <img 
          src="/lovable-uploads/whitewojack.png"
          alt="White Wojak Thinking" 
          className="mx-auto w-48 h-48 animate-pulse"
        />
        <div className="space-y-4">
          <p className="text-xl font-medium text-gray-700 animate-fade-in">
            {messages[messageIndex]}
          </p>
          {showTimeout && (
            <div className="text-sm text-gray-500">
              <p>This is taking longer than usual.</p>
              <p>We're still processing your tweets...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 