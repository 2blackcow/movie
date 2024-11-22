import React from 'react';
import logo from '../assets/movie.png';
import userIcon from '../assets/userIcon.png';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const navigation = [
    { label: 'TV Shows', href: 'tv' },
    { label: 'Movies', href: 'movie' },
  ];

  return (
    <header className="fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75 flex items-center justify-between px-6 z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <img src={logo} alt="logo" className="w-20" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex items-center gap-4">
        {navigation.map((nav) => (
          <NavLink
            key={nav.label}
            to={nav.href}
            className={({ isActive }) =>
              `text-white hover:text-yellow-300 ${
                isActive ? 'text-yellow-300 font-bold' : ''
              }`
            }
          >
            {nav.label}
          </NavLink>
        ))}
      </nav>

      {/* User Icon Section */}
      <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all flex items-center justify-center">
        <img src={userIcon} alt="User Icon" className="w-full h-full" />
      </div>
    </header>
  );
};

export default Header;
