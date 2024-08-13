import React, { useEffect, useState } from "react";
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

  // 요청이 이미 처리되었는지 추적하기 위한 상태
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (!code || !isOwner || hasRequested) {
        return;
      }

      // 요청이 시작되었음을 표시
      setHasRequested(true);

      try {
        // 카카오 로그인 콜백 엔드포인트에 code를 포함하여 요청
        const response = await fetchData(`/users/kakao/callback?code=${code}&owner=${isOwner}`, {
          method: 'GET',
        });

        // response의 data 객체에서 id, nickname, email을 추출하여 콘솔에 출력
        const { id, nickname, email } = response.data;

        console.log('Kakao User ID:', id);
        console.log('Kakao User Nickname:', nickname);
        console.log('Kakao User Email:', email);

        // 여기서 responseBody 역할을 하는 부분은 이미 처리된 response의 데이터입니다.
        // 필요 시 추가 처리 로직을 여기에 작성합니다.

        // setRole(response.data.role); // 예시: role 설정
        //
        // const accessToken = response.headers.get('Authorization');
        // const refreshToken = response.headers.get('Refresh');
        //
        // if (accessToken) {
        //   localStorage.setItem('accessToken', accessToken);
        // }
        // if (refreshToken) {
        //   localStorage.setItem('refreshToken', refreshToken);
        // }
        //
        // alert('로그인에 성공했습니다!');
        //
        // if (response.data.role === 'ROLE_OWNER') {
        //   navigate('/dashboard');
        // } else if (response.data.role === 'ROLE_CUSTOMER') {
        //   navigate('/restaurants');
        // } else {
        //   navigate('/');
        // }

      } catch (error) {
        console.error(`로그인 에러: ${error.message}`);
        // navigate('/login');
      }
    };

    if (code && isOwner) {
      handleKakaoLogin();
    }
  }, [code, isOwner, navigate, hasRequested]);

  return <div>로그인 중입니다.</div>;
};

export default KakaoLoginRedirect;
