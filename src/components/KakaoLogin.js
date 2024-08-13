const KAKAO_API_KEY = process.env.REACT_APP_API_KEY_KAKAO;

export const kakaoLogin = async (isOwner) => {
  const kakaoClientId = KAKAO_API_KEY;
  const redirectUri = `http://localhost:3000/kakao/callback`;
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${isOwner}`;

  window.location.href = kakaoAuthUrl;
};
