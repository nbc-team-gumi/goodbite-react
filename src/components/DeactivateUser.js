import React, { useState } from 'react';
import './DeactivateUser.css';

function DeactivateUser() {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        // Here you would typically send a request to your server to delete the account
        alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
        window.location.href = '/'; // Redirect to homepage or login page after deletion
      }
    } else {
      alert('비밀번호를 입력해주세요.');
    }
  };

  return (
      <div className="deactivate-user">
        <header className="header">
          GOOD BITE
        </header>
        <main className="main">
          <div className="form-container">
            <h2>회원 탈퇴</h2>
            <p>정말로 탈퇴하시겠습니까? 탈퇴 후에는 모든 정보가 삭제됩니다.</p>
            <form id="delete-account-form" onSubmit={handleSubmit}>
              <input
                  type="password"
                  id="confirm-password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <button type="submit">탈퇴하기</button>
            </form>
            <div className="cancel-link">
              <a href="/account">취소하고 돌아가기</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default DeactivateUser;
