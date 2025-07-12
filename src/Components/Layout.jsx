import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';

const Layout = () => {
  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
