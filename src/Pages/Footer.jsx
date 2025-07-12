import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-700 text-neutral-400 text-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Logo and copyright */}
        <div className="text-center md:text-left">
          <Link to="/" className="text-white font-bold text-lg hover:text-cyan-400">
            StackIt
          </Link>
          <p className="text-sm mt-1">&copy; {new Date().getFullYear()} StackIt. All rights reserved.</p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/about" className="hover:text-cyan-400 transition">About</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>
          <Link to="/privacy" className="hover:text-cyan-400 transition">Privacy</Link>
          <Link to="/terms" className="hover:text-cyan-400 transition">Terms</Link>
        </div>

        {/* Right: Socials or tagline */}
        <div className="text-center md:text-right">
          <p className="text-xs">Built with ❤️ using React & Tailwind</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
