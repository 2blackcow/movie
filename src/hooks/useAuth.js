import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const tryLogin = async (email, password, rememberMe) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('유효한 이메일 형식이 아닙니다.');
      }

      const user = users.find(user => user.id === email && user.password === password);
      
      if (user) {
        localStorage.setItem('TMDB-Key', user.password); // API 키 저장
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('isLoggedIn', 'true');
        }
        navigate('/');
        showToast('로그인 성공!', 'success');
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      setError(error.message);
      showToast(error.message, 'error');
    }
  };

  const tryRegister = async (email, password, confirmPassword, agreeToTerms) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('유효한 이메일 형식이 아닙니다.');
      }

      if (password !== confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      if (!agreeToTerms) {
        throw new Error('필수 약관에 동의해주세요.');
      }

      const userExists = users.some(existingUser => existingUser.id === email);
      
      if (userExists) {
        throw new Error('이미 존재하는 이메일입니다.');
      }

      users.push({ id: email, password: password });
      localStorage.setItem('users', JSON.stringify(users));
      
      showToast('회원가입 성공!', 'success');
      navigate('/signin');
    } catch (error) {
      setError(error.message);
      showToast(error.message, 'error');
    }
  };

  return { tryLogin, tryRegister, error };
};