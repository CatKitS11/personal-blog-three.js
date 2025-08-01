import React from 'react';
import { Button } from './ui/button';

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">
        hh.
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex items-center gap-4">
        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
          Log in
        </Button>
        <Button className="bg-gray-800 text-white hover:bg-gray-700">
          Sign up
        </Button>
      </div>
    </nav>
  );
};

export default NavBar; 