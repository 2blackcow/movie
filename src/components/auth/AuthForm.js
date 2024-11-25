import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { userStorage, STORAGE_KEYS } from '../../utils/localStorage';

const AuthForm = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className={`bg-white p-8 rounded-lg shadow-md transition-transform duration-500 ease-in-out transform ${isSignIn ? 'rotate-y-0' : 'rotate-y-180'}`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isSignIn ? '로그인' : '회원가입'}
            </h2>
            {!isSignIn && (
              <p className="mt-2 text-sm text-gray-600">
                TMDB API 키가 필요합니다.
                <a 
                  href="https://www.themoviedb.org/settings/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                >
                  여기서 발급받으세요
                </a>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <MdVisibility className="h-5 w-5 text-gray-400" />
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  필수 약관에 동의합니다
                </label>
              </div>
            )}

            {isSignIn && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    로그인 상태 유지
                  </label>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? '처리 중...' : (isSignIn ? '로그인' : '회원가입')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={toggleForm}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
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