const KAKAO_API_KEY = process.env.REACT_APP_API_KEY_KAKAO;
export const kakaoLogin = () => {
  const kakaoClientId = KAKAO_API_KEY;
  const redirectUri = 'http://api.goodbite.site/users/kakao/callback';
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = kakaoAuthUrl;
};
