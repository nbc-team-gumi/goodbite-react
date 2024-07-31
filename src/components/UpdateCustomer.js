import React, { useState } from 'react';
import './UpdateCustomer.css';

function UpdateCustomer() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');

  const changePassword = () => {
    alert('비밀번호 변경 요청');
  };

  const changeNickname = () => {
    alert('닉네임 변경 요청');
  };

  const changePhoneNumber = () => {
    alert('휴대폰 번호 변경 요청');
  };

  return (
      <div className="update-customer">
        <header className="header">
          GOOD BITE
        </header>
        <main className="main">
          <div className="form-container">
            <h2>회원정보수정</h2>
            <form>
              <div>
                <label htmlFor="current-password">Password</label>
                <input
                    type="password"
                    id="current-password"
                    placeholder="현재비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    id="new-password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={changePassword}>
                  비밀번호 수정
                </button>
              </div>
              <div>
                <label htmlFor="nickname">Nickname</label>
                <input
                    type="text"
                    id="nickname"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <button type="button" onClick={changeNickname}>
                  닉네임 수정
                </button>
              </div>
              <div>
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="text"
                    id="phone"
                    placeholder="휴대폰번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button type="button" onClick={changePhoneNumber}>
                  휴대폰번호 수정
                </button>
              </div>
            </form>
            <div className="footer-link">
              <a href="/delete-account">탈퇴하시겠습니까?</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default UpdateCustomer;
