import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';

const Navbar = ({ className = '' }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [userInitials] = useState('JD');

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setUnreadCount(isLoggedIn ? 3 : 0);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ask', label: 'Ask' },
    { to: '/notifications', label: 'Notifications' },
  ];

  const authLinks = isLoggedIn
    ? [{ to: '/profile', label: 'Profile' }, { to: '/logout', label: 'Logout' }]
    : [{ to: '/login', label: 'Login' }, { to: '/register', label: 'Register' }];

  return (
    <nav className={`bg-neutral-900 shadow-lg border-b border-neutral-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-cyan-400 transition-colors duration-200"
            >
              StackIt
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/notifications"
              className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl  transition-all duration-200 font-medium flex items-center gap-2"
            >
              <div className="relative">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              Notifications
            </Link>

            {/* Auth */}
            <div className="flex items-center gap-3 border-l border-neutral-700 pl-6">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-medium text-sm cursor-pointer">
                    {userInitials}
                  </div>
                  <button
                    onClick={toggleLogin}
                    className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-cyan-500 text-white px-4 py-2 rounded-xl hover:bg-cyan-600 transition-all duration-200 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/notifications"
              className="relative p-2 text-neutral-100 hover:text-cyan-400 hover:bg-neutral-800 rounded-xl transition-all duration-200"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleDrawer}
              className="p-2 text-neutral-100 hover:text-cyan-400 hover:bg-neutral-800 rounded-xl transition-all duration-200"
            >
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-60"
          onClick={closeDrawer}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-sm bg-neutral-900 text-neutral-100 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          } border-l border-neutral-700`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-neutral-700">
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button
                onClick={closeDrawer}
                className="p-2 text-neutral-100 hover:text-cyan-400 hover:bg-neutral-800 rounded-xl transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 py-6">
              <div className="px-6 space-y-1">
                {navLinks.slice(0, 2).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeDrawer}
                    className="block px-4 py-3 text-neutral-100 hover:text-cyan-400 hover:bg-neutral-800 rounded-xl transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-neutral-700 my-4" />

                {authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeDrawer}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      link.label === 'Register'
                        ? 'bg-cyan-500 text-white hover:bg-cyan-600 text-center'
                        : 'text-neutral-100 hover:text-cyan-400 hover:bg-neutral-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-neutral-700">
              {isLoggedIn && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-medium">
                    {userInitials}
                  </div>
                  <div>
                    <p className="font-medium text-white">John Doe</p>
                    <p className="text-sm text-neutral-400">john@example.com</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
