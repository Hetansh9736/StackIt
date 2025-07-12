import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount] = useState(3);
  const [userInitials, setUserInitials] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const initials = currentUser.displayName
          ? currentUser.displayName.split(' ').map(n => n[0]).join('')
          : currentUser.email?.[0] || 'U';
        setUserInitials(initials.toUpperCase());
      } else {
        setUser(null);
        setUserInitials('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsDrawerOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ask', label: 'Ask' },
  ];

  const authLinks = user
    ? [{ label: 'Logout', onClick: handleLogout }]
    : [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register', isPrimary: true },
      ];

  return (
    <nav className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-white hover:text-cyan-400">StackIt</Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all font-medium"
            >
              {label}
            </Link>
          ))}

          <Link to="/notifications" className="relative text-neutral-100 hover:text-cyan-400 flex items-center gap-2">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            Notifications
          </Link>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-neutral-700">
              <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-medium">
                {userInitials}
              </div>
              <button
                onClick={handleLogout}
                className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-700">
              {authLinks.map(({ to, label, isPrimary, onClick }) => (
                to ? (
                  <Link
                    key={label}
                    to={to}
                    className={`${
                      isPrimary
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        : 'text-neutral-100 hover:text-cyan-400'
                    } px-4 py-2 rounded-xl transition-all font-medium`}
                  >
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={onClick}
                    className="text-neutral-100 hover:text-cyan-400 px-3 py-2 rounded-xl transition-all font-medium"
                  >
                    {label}
                  </button>
                )
              ))}
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/notifications" className="relative text-neutral-100 hover:text-cyan-400">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setIsDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-neutral-900 shadow-2xl p-6 space-y-4 text-white border-l border-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsDrawerOpen(false)}
                className="block py-2 px-4 rounded hover:bg-neutral-800"
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-neutral-700" />
            {user ? (
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-neutral-800 rounded">
                Logout
              </button>
            ) : (
              authLinks.map(({ to, label, isPrimary, onClick }) =>
                to ? (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      isPrimary ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'hover:bg-neutral-800'
                    }`}
                  >
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={() => {
                      onClick();
                      setIsDrawerOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-800 rounded"
                  >
                    {label}
                  </button>
                )
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
