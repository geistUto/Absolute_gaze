import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage (or you can check authentication state from your global state/store)
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // User is logged in
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsAuthenticated(false); // Update state
    router.push('/auth'); // Redirect to auth page
  };

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full inline-block border-blue-400 py-8">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="cursor-pointer font-bold text-4xl text-white">
              Absolute gaze
            </span>
          </Link>

          {/* Conditionally render based on authentication state */}
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 text-lg rounded"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/auth">
              <a className="bg-silver-500 hover:bg-silver-700 text-white font-bold py-3 px-6 text-lg rounded">
                Sign In
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
