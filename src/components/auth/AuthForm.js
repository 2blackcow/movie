import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MdVisibility, MdVisibilityOff, MdArrowBack } from 'react-icons/md';
import { userStorage, STORAGE_KEYS } from '../../utils/localStorage';
import { loadUserList } from '../../store/movieSlice';
import { showToast } from '../../components/common/Toast';

const AuthForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateTMDBApiKey = async (apiKey) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      agreeToTerms: false
    });
  };

  const handleBack = () => {
    if (!isSignIn) {
      setIsSignIn(true);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateEmail(formData.email)) {
        throw new Error('유효한 이메일 형식이 아닙니다.');
      }

      if (isSignIn) {
        // 로그인 로직
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
        const user = users.find(
          (u) => u.id === formData.email && u.password === formData.password
        );

        if (!user) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
        }

        userStorage.initUser(formData.email);
        localStorage.setItem(STORAGE_KEYS.TMDB_KEY, user.password);
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");

        if (formData.rememberMe) {
          localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, formData.email);
        }
        dispatch(loadUserList());

        alert('로그인 성공!');
        navigate("/");
      } else {
        // 회원가입 로직
        if (!formData.agreeToTerms) {
          throw new Error('필수 약관에 동의해주세요.');
        }

        const isValidApiKey = await validateTMDBApiKey(formData.password);
        if (!isValidApiKey) {
          throw new Error('유효하지 않은 TMDB API 키입니다.');
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.id === formData.email);

        if (userExists) {
          throw new Error('이미 존재하는 이메일입니다.');
        }

        users.push({
          id: formData.email,
          password: formData.password
        });
        localStorage.setItem('users', JSON.stringify(users));

        alert('회원가입 성공!');
        setIsSignIn(true);
      }
    } catch (error) {
      setError(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4 py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 to-red-600/20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <div className="w-full max-w-[95%] sm:max-w-md relative">
        {/* 뒤로가기 버튼 추가 */}
        {!isSignIn && (
          <button
            onClick={handleBack}
            className="absolute -top-12 left-0 text-white hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
          >
            <MdArrowBack size={24} />
            <span>로그인으로 돌아가기</span>
          </button>
        )}

        <div 
          className={`
            bg-neutral-800/80 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl 
            shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]
            transition-all duration-500 ease-in-out transform perspective-1000
            ${isSignIn ? 'rotate-y-0' : 'rotate-y-180'}
            border border-purple-500/30
          `}
        >
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {isSignIn ? '로그인' : '회원가입'}
            </h2>
            {!isSignIn && (
              <p className="mt-2 text-xs sm:text-sm text-gray-400">
                TMDB API 키가 필요합니다.
                <a 
                  href="https://www.themoviedb.org/settings/api" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="font-medium text-purple-400 hover:text-purple-300 ml-1"
                >
                  여기서 발급받으세요
                </a>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-neutral-700/50 border border-purple-500/30 
                         rounded-md shadow-sm text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                {isSignIn ? '비밀번호' : 'TMDB API Key'}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-neutral-700/50 border border-purple-500/30 
                           rounded-md shadow-sm text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-purple-400"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="h-5 w-5" />
                  ) : (
                    <MdVisibility className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {!isSignIn && (
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                  필수 약관에 동의합니다
                </label>
              </div>
            )}

            {isSignIn && (
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  로그인 상태 유지
                </label>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${loading ? 'bg-purple-500/50' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  transition-all duration-200
                `}
              >
                {loading ? '처리 중...' : (isSignIn ? '로그인' : '회원가입')}
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6">
            <button
              onClick={toggleForm}
              className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              {isSignIn ? '회원가입하기' : '로그인하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;