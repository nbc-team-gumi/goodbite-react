import React from 'react';
import '../styles/OwnerMypage.css';

const OwnerMypage = () => {
  return (
      <div className="owner-mypage">
        <header>
          GOOD BITE
        </header>
        <main>
          <div className="info-container">
            <h2>회원정보 조회</h2>
            <div className="info-group">
              <span className="info-label">이름</span>
              <span className="info-value">홍길동</span>
            </div>
            <div className="info-group">
              <span className="info-label">이메일</span>
              <span className="info-value">hong@example.com</span>
            </div>
            <div className="info-group">
              <span className="info-label">닉네임</span>
              <span className="info-value">맛있는사람</span>
            </div>
            <div className="info-group">
              <span className="info-label">전화번호</span>
              <span className="info-value">010-1234-5678</span>
            </div>
            <div className="info-group">
              <span className="info-label">가입일</span>
              <span className="info-value">2023-06-15</span>
            </div>
            <div className="info-group">
              <span className="info-label">사업자번호</span>
              <span className="info-value">123-45-67890</span>
            </div>
            <a href="/UpdateOwner" className="edit-button">회원정보 수정</a>
            <div className="footer-link">
              <a href="/">홈으로 돌아가기</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default OwnerMypage;
