import React, { useState, useEffect } from 'react';
import '../styles/CustomerMypage.css';

import { fetchData } from '../util/api';

const CustomerMypage = () => {

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData(`/customers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response);

        if (response.statusCode === 200) {
          setUser(response.data);
        } else {
          throw new Error(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="customer-mypage">
        <header>
          GOOD BITE
        </header>
        <main>
          <div className="info-container">
            <h2>회원정보 조회</h2>
            <div className="info-group">
              <span className="info-label">이메일</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-group">
              <span className="info-label">닉네임</span>
              <span className="info-value">{user.nickname}</span>
            </div>
            <div className="info-group">
              <span className="info-label">전화번호</span>
              <span className="info-value">{user.phoneNumber}</span>
            </div>
            <a href="/update-customer" className="edit-button">회원정보 수정</a>
            <div className="footer-link">
              <a href="/restaurants">홈으로 돌아가기</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default CustomerMypage;
