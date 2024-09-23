import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // User is logged in
    } else {
      setIsAuthenticated(false); // User is logged out
    }
  }, [router.pathname]); // Listen for route changes to update the state

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
              Absolute Gaze
            </span>
          </Link>

          {/* Conditionally render based on authentication state */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              {/* Navigation Menu when logged in */}
              <Link href="/snippets">
                <a className="text-lg text-white font-semibold">Snippets</a>
              </Link>
              <Link href="/knowledge-graph">
                <a className="text-lg text-white font-semibold">Knowledge Graph</a>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 text-lg rounded"
              >
                Sign Out
              </button>
            </div>
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
