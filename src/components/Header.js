import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineSearch, MdMenu, MdClose, MdLogout } from "react-icons/md";
import { navigation } from "../constants/navigation";
import logo from "../assets/movie.png";
import userIcon from "../assets/userIcon.png";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    }
  }, [searchInput, navigate]);

  useEffect(() => {
    // 사용자 메뉴 외부 클릭 시 닫기
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('TMDB-Key');
    localStorage.removeItem('rememberedEmail');
    
    // 로그아웃 메시지 표시
    alert('로그아웃되었습니다.');
    
    // 로그인 페이지로 이동
    navigate('/signin');
  };

  return (
    <>
      <header className="fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75 flex items-center justify-between px-5 sm:px-10 z-50">
        {/* Logo Section */}
        <Link className="flex items-center mr-6">
          <img src={logo} alt="logo" className="w-12 sm:w-16 md:w-20" />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((nav) => (
            <NavLink
              key={nav.label}
              to={nav.href}
              className={({ isActive }) =>
                `text-white hover:text-red-800 font-bold ${
                  isActive ? "text-red-800 font-bold" : ""
                }`
              }
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        {/* Search and User Section */}
        <div className="ml-auto flex items-center gap-4">
          <form
            className="hidden sm:flex items-center gap-2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="영화 제목을 입력하세요..."
              className="bg-transparent text-white border-b border-white focus:outline-none px-2 py-1 w-44 sm:w-64"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <button type="submit" className="hover:text-red-700">
              <MdOutlineSearch size={30} />
            </button>
          </form>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-all flex items-center justify-center"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <img src={userIcon} alt="User Icon" className="w-full h-full" />
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <MdLogout />
                  로그아웃
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-red-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-neutral-800 bg-opacity-95 z-40 md:hidden">
          <nav className="flex flex-col items-center pt-8 gap-6">
            {navigation.map((nav) => (
              <NavLink
                key={nav.label}
                to={nav.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-white hover:text-red-800 font-bold ${
                    isActive ? "text-red-800 font-bold" : ""
                  }`
                }
              >
                {nav.icon}
                <span>{nav.label}</span>
              </NavLink>
            ))}
            {/* Mobile Search */}
            <form
              className="sm:hidden flex items-center gap-2 w-4/5 max-w-xs"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="영화 제목을 입력하세요..."
                className="w-full bg-transparent text-white border-b border-white focus:outline-none px-2 py-1"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
              <button type="submit" className="hover:text-red-700">
                <MdOutlineSearch size={24} />
              </button>
            </form>
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-red-800 font-bold"
            >
              <MdLogout />
              <span>로그아웃</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;