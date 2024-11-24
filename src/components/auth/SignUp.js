import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    tmdbApiKey: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 이메일 검증
      if (!validateEmail(formData.email)) {
        throw new Error('유효한 이메일 형식이 아닙니다.');
      }

      // TMDB API 키 검증
      const isValidApiKey = await validateTMDBApiKey(formData.tmdbApiKey);
      if (!isValidApiKey) {
        throw new Error('유효하지 않은 TMDB API 키입니다.');
      }

      // 약관 동의 확인
      if (!formData.agreeToTerms) {
        throw new Error('필수 약관에 동의해주세요.');
      }

      // 기존 사용자 확인
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(user => user.id === formData.email);

      if (userExists) {
        throw new Error('이미 존재하는 이메일입니다.');
      }

      // 새 사용자 추가
      users.push({
        id: formData.email,
        password: formData.tmdbApiKey
      });
      localStorage.setItem('users', JSON.stringify(users));

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/signin');

    } catch (error) {
      setError(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md relative">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="뒤로 가기"
        >
          <MdArrowBack size={24} />
        </button>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
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
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              아이디(이메일 형식)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="tmdbApiKey" className="block text-sm font-medium text-gray-700">
              비밀번호(TMDB API Key)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="tmdbApiKey"
                name="tmdbApiKey"
                type={showPassword ? "text" : "password"}
                required
                value={formData.tmdbApiKey}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
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

          {error && (
            <div className="text-red-600 text-sm">
              {error}
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
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
