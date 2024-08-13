import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchData } from "../util/api";
import { useUser } from '../UserContext';

const KakaoLoginRedirect = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');
  const isOwner = queryParams.get('state');
  const navigate = useNavigate();
  const { setRole } = useUser();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (!code || !isOwner) {
        console.error('No code found in query parameters');

        return;
      }

      try {
        // 카카오 로그인 콜백 엔드포인트에 code를 포함하여 요청
        const response = await fetchData(`/users/kakao/callback?code=${code}&owner=${isOwner}`, {
          method: 'GET',
        });

        const responseBody = await response.json();

        setRole(responseBody.role);

        const accessToken = response.headers.get('Authorization');
        const refreshToken = response.headers.get('Refresh');

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        alert('로그인에 성공했습니다!');

        if (responseBody.role === 'ROLE_OWNER') {
          navigate('/dashboard');
        } else if (responseBody.role === 'ROLE_CUSTOMER') {
          navigate('/restaurants');
        } else {
          navigate('/');
        }

      } catch (error) {
        console.error(`로그인 에러: ${error.message}`);
        // navigate('/login');
      }
    };

    handleKakaoLogin();
  }, [code, navigate]);

  return <div>로그인 중입니다.</div>;
};
export default KakaoLoginRedirect;