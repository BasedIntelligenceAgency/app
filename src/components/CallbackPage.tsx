import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOAuth } from '../hooks/useOAuth';

export default function CallbackPage() {
  const [searchParams] = useSearchParams();
  const { handleCallback, error } = useOAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      handleCallback(code, state);
    }
  }, [searchParams, handleCallback]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Completing Login</h1>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    </div>
  );
} 