const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchData = async (endpoint, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken || '',
      'Refresh': refreshToken || '',
      ...options.headers,
    },
    credentials: 'include', // Cookie
  });

  // 토큰이 만료된 경우 갱신 시도
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': refreshToken,
      },
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      accessToken = refreshData.accessToken;
      localStorage.setItem('accessToken', accessToken);

      // 갱신된 토큰으로 원래 요청을 다시 시도
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken || '',
          'Refresh': refreshToken || '',
          ...options.headers,
        },
        credentials: 'include',
      });
    } else {
      // Refresh token도 만료된 경우 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Session expired. Please log in again.');
    }
  }

  const contentType = response.headers.get('content-type');
  let errorMessage = 'Network response was not ok';

  if (contentType && contentType.indexOf('application/json') !== -1) {
    const responseBody = await response.json();
    if (!response.ok) {
      errorMessage = responseBody.message || JSON.stringify(responseBody);
      console.error('Error fetching data:', errorMessage);
      throw new Error(errorMessage);
    }
    console.log('Response body:', responseBody);
    return responseBody;
  } else {
    const responseBody = await response.text();
    if (!response.ok) {
      errorMessage = responseBody;
      console.error('Error fetching data:', errorMessage);
      throw new Error(errorMessage);
    }
    return responseBody;
  }
};
