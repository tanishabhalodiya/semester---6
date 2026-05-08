import React from 'react';
import { NavLink } from 'react-router-dom';
import { ScanFace } from 'lucide-react';

const Navbar = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live Detection', path: '/live' },
    { name: 'Upload', path: '/upload' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Training Data', path: '/training' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo / Branding */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <span className="font-extrabold text-2xl tracking-tighter text-proxima uppercase flex items-center gap-2">
              <ScanFace className="w-7 h-7" /> MASK-NET
            </span>
          </div>

          {/* Center Nav Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <div className="hidden md:flex items-center justify-end">
             <NavLink to="/live" className="px-6 py-2.5 rounded-full border border-slate-700 text-sm font-medium hover:border-brand-500 hover:text-brand-500 transition-all text-slate-300 bg-slate-800/50 backdrop-blur-sm">
               Start System
             </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
