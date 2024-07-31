import React, { useState } from 'react';
import './UpdateOwner.css'; // 스타일을 이 파일로 분리했습니다.

function UpdateOwner() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');

  const updatePassword = () => {
    alert('비밀번호가 수정되었습니다.');
  };

  const updateNickname = () => {
    alert('닉네임이 수정되었습니다.');
  };

  const updatePhoneNumber = () => {
    alert('휴대폰번호가 수정되었습니다.');
  };

  const updateBusinessNumber = () => {
    alert('사업자번호가 수정되었습니다.');
  };

  return (
      <div className="App">
        <header className="header">
          <h1>GOOD BITE</h1>
        </header>
        <div className="container">
          <h2>회원정보수정</h2>
          <form id="updateForm">
            <input
                type="password"
                placeholder="현재비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <button type="button" onClick={updatePassword}>
              비밀번호 수정
            </button>

            <input
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
            />
            <button type="button" onClick={updateNickname}>
              닉네임 수정
            </button>

            <input
                type="tel"
                placeholder="휴대폰번호"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
            />
            <button type="button" onClick={updatePhoneNumber}>
              휴대폰번호 수정
            </button>

            <input
                type="text"
                placeholder="사업자번호"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                required
            />
            <button type="button" onClick={updateBusinessNumber}>
              사업자번호 수정
            </button>
          </form>
          <p className="forgot-password">회원탈퇴하시겠습니까?</p>
        </div>
      </div>
  );
}

export default UpdateOwner;
