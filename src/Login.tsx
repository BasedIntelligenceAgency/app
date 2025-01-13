export const LoginPage: React.FC = () => {
    const handleLogin = () => {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth/request_token`;
    };
  
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="items-center flex flex-col justify-center border-2 border-white rounded-lg mx-auto w-1/2 p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Are You Based Or Biased?</h1>
            <button
              onClick={handleLogin}
              className="bg-white hover:bg-white-600 ml-auto mr-auto text-black font-bold py-2 px-4 rounded"
            >
              Log in With X
            </button>
          </div>
        </div>
    );
  };