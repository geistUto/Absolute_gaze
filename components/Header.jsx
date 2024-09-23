import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';  // Add these icons from Heroicons

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [router.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/auth');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-b w-full py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <span className="cursor-pointer font-bold text-2xl md:text-4xl text-white">
              Absolute Gaze
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-white focus:outline-none"
            >
              {menuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <Link href="/snippets">
                  <a className="text-lg text-white font-semibold">Snippets</a>
                </Link>
                <Link href="/knowledge-graph">
                  <a className="text-lg text-white font-semibold">Knowledge Graph</a>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 text-lg rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded">
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 space-y-4">
          {isAuthenticated ? (
            <>
              <Link href="/snippets">
                <a className="block text-lg font-semibold" onClick={() => setMenuOpen(false)}>
                  Snippets
                </a>
              </Link>
              <Link href="/knowledge-graph">
                <a className="block text-lg font-semibold" onClick={() => setMenuOpen(false)}>
                  Knowledge Graph
                </a>
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="block w-full text-left bg-red-500 hover:bg-red-700 py-3 px-6 text-lg rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth">
              <a
                className="block w-full text-left bg-blue-500 hover:bg-blue-700 py-3 px-6 text-lg rounded"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </a>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;