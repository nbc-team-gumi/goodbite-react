import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useUser} from '../UserContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const KakaoLoginRedirect = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');
  const isOwner = queryParams.get('state') === 'true';
  const navigate = useNavigate();
  const {setRole} = useUser();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (!code || isOwner === null) {
        return;
      }

      try {
        // 카카오 로그인 콜백 엔드포인트에 code를 포함하여 요청
        const response = await fetch(
            `${API_BASE_URL}/users/kakao/callback?code=${code}&owner=${isOwner}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

        if (!response.ok) {
          throw new Error('카카오 로그인 요청 실패');
        }

        const responseBody = await response.json();
        if (responseBody && responseBody.data) {
          const {nickname, email} = responseBody.data;
          const accessToken = response.headers.get('Authorization');
          const refreshToken = response.headers.get('Refresh');

          // 데이터베이스 일치하는 회원이 존재할 때
          if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // 필요에 따라 role 설정 등의 추가 작업
            if (isOwner === true) {
              setRole('ROLE_OWNER');
            } else {
              setRole('ROLE_CUSTOMER');
            }

            alert('로그인에 성공했습니다!');
            navigate('/');
          } else {
            const password = generateRandomString();

            // 카카오 전용 회원가입 페이지로
            const userType = isOwner ? 'owner' : 'customer';
            navigate('/kakao/signup', {
              state: { nickname, email, password, userType }
            });
          }
        } else {
          throw new Error('Invalid response data');
        }

      } catch (error) {
        console.error(`로그인 에러: ${error.message}`);
        // navigate('/login');
      }
    };

    handleKakaoLogin();
  }, [code, isOwner, navigate, setRole]);

  return <div>로그인 중입니다.</div>;
};

const generateRandomString = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '@$!%*?&';

  const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

  // 각 그룹에서 하나씩 문자를 뽑아 최소 요구 조건을 만족
  let randomString = '';
  randomString += getRandomChar(letters);
  randomString += getRandomChar(numbers);
  randomString += getRandomChar(specialChars);

  // 나머지 자리를 랜덤하게 채움
  const allChars = letters + numbers + specialChars;
  while (randomString.length < 10) {
    randomString += getRandomChar(allChars);
  }

  // 문자열을 무작위로 섞음
  return randomString.split('').sort(() => 0.5 - Math.random()).join('');
};

export default KakaoLoginRedirect;
