import React, { useState, useEffect } from "react";
import logo from "../assets/movie.png";
import userIcon from "../assets/userIcon.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import { navigation } from "../constants/navigation";

const Header = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate()

  
  useEffect(()=>{
    if(searchInput){
      navigate(`/search?q=${searchInput}`)
    }
  },[searchInput])

  const handleSubmit = (e) =>{
    e.preventDefault()
  }

  return (
    <header className="fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75 flex items-center justify-between px-5 sm:px-10 z-50">
      {/* Logo Section */}
      <Link className="flex items-center mr-6">
        <img src={logo} alt="logo" className="w-16 sm:w-20" />
      </Link>

      {/* Navigation Menu */}
      <nav className="flex items-center gap-6">
        {navigation.map((nav) => (
          <NavLink
            key={nav.label}
            to={nav.href}
            className={({ isActive }) =>
              `text-white hover:text-red-800 font-bold${
                isActive ? "text-red-800 font-bold" : ""
              }`
            }
          >
            {nav.label}
          </NavLink>
        ))}
      </nav>

      {/* User Icon Section */}
      <div className="ml-auto flex items-center gap-4 sm:gap-6">
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent text-white border-b border-white focus:outline-none px-2 py-1 w-44 sm:w-64"
            onChange={(e)=>setSearchInput(e.target.value)}
            value={searchInput}
          />
          <button type="submit" className="hover:text-red-700">
          <MdOutlineSearch size={30} />

          </button>
        </form>
        
        <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all flex items-center justify-center">
          <img src={userIcon} alt="User Icon" className="w-full h-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
