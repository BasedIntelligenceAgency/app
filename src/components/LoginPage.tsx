import { useOAuth } from '../hooks/useOAuth';

export default function LoginPage() {
  const { startLogin, error, isLoading } = useOAuth();

  const handleClick = async () => {
    await startLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 bg-gray-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center space-x-4">
          <img 
            src="/lovable-uploads/greywojack.png"
            alt="Grey Wojak" 
            className="w-32 h-32"
          />
          <img 
            src="/lovable-uploads/chad.png"
            alt="Chad" 
            className="w-32 h-32"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2">based or biased?</h1>
        <p className="text-xl text-gray-600">Are you a free-thinking chad or a pawn in someone else's game?</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`bg-[#1DA1F2] text-white px-8 py-3 rounded-full font-bold text-lg 
          hover:bg-[#1a8cd8] transition-colors flex items-center space-x-2 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>
          {isLoading ? (
            <span className="flex items-center">
              Connecting...
              <svg className="animate-spin ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : 'Log in with X'}
        </span>
      </button>
      
      <p className="text-sm text-gray-500 max-w-md text-center">
        Log in and we'll run your tweets through our super accurate AI algorithm to find out.
      </p>
    </div>
  );
} 