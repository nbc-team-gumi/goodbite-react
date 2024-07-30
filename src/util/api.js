// 백엔드 API 호출
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const fetchData = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Cookie
  });


  const contentType = response.headers.get('content-type');
  let errorMessage = 'Network response was not ok';

  if (contentType && contentType.indexOf('application/json') !== -1) {
    const responseBody = await response.json();
    if (!response.ok) {
      errorMessage = responseBody.message || JSON.stringify(responseBody);
      throw new Error(errorMessage);
    }
    return responseBody;
  } else {
    const responseBody = await response.text();
    if (!response.ok) {
      errorMessage = responseBody;
      throw new Error(errorMessage);
    }
    return responseBody;
  }
};