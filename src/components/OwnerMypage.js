import React, { useState, useEffect } from 'react';
import '../styles/OwnerMypage.css';
import { fetchData } from '../util/api';
import { Link } from 'react-router-dom';

const OwnerMypage = () => {

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData(`/owners`, {
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
      <div className="owner-mypage">
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
            <div className="info-group">
              <span className="info-label">사업자번호</span>
              <span className="info-value">{user.businessNumber}</span>
            </div>
            <Link to="/update-owner" className="edit-button">회원정보 수정</Link>
            <div className="footer-link">
              <a href="/">홈으로 돌아가기</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default OwnerMypage;
