import { useEffect, useState } from 'react';

const LoadingMessages = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Reticulating splines...",
    "Calculating your based score...",
    "Analyzing conspiracy theories...",
    "Measuring truthfulness quotient...",
    "Evaluating tribal affiliations...",
    "Quantifying contrarian beliefs...",
    "Calibrating sincerity metrics...",
    "Processing mainstream opinions...",
    "Computing ideological vectors...",
    "Triangulating political compass..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin w-12 h-12">
        <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div className="text-lg font-medium text-center animate-pulse">
        {messages[messageIndex]}
      </div>
    </div>
  );
};

export default LoadingMessages;