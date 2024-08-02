import React, { useState, useEffect } from 'react';
import '../styles/UpdateOwner.css'; // 스타일을 이 파일로 분리했습니다.
import { fetchData } from '../util/api'; // fetchData 메서드 가져오기

function UpdateOwner() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData('/owners', {
          method: 'GET',
        });
        setUser(response.data);
        setNickname(response.data.nickname);
        setPhoneNumber(response.data.phoneNumber);
        setBusinessNumber(response.data.businessNumber);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);//추가

  const updatePassword = async () => {
    try {
      await fetchData('/owners/password', {
        method: 'PATCH',
        body: JSON.stringify({   "currentPassword": currentPassword,
          "newPassword": newPassword }),
      });
      alert('비밀번호가 수정되었습니다.');
    } catch (error) {
      alert('비밀번호 수정 중 오류가 발생했습니다.');
      console.error('Error updating password:', error);
    }
  };

  const updateNickname = async () => {
    try {
      await fetchData('/owners/nickname', {
        method: 'PATCH',
        body: JSON.stringify({ "newNickname": nickname }),
      });
      alert('닉네임이 수정되었습니다.');
    } catch (error) {
      alert('닉네임 수정 중 오류가 발생했습니다.');
      console.error('Error updating nickname:', error);
    }
  };

  const updatePhoneNumber = async () => {
    try {
      await fetchData('/owners/phone-number', {
        method: 'PATCH',
        body: JSON.stringify({ "newPhoneNumber": phoneNumber }),
      });
      alert('휴대폰번호가 수정되었습니다.');
    } catch (error) {
      alert('휴대폰번호 수정 중 오류가 발생했습니다.');
      console.error('Error updating phone number:', error);
    }
  };

  const updateBusinessNumber = async () => {
    try {
      await fetchData('/owners/business-number', {
        method: 'PATCH',
        body: JSON.stringify({ "newBusinessNumber": businessNumber }),
      });
      alert('사업자번호가 수정되었습니다.');
    } catch (error) {
      alert('사업자번호 수정 중 오류가 발생했습니다.');
      console.error('Error updating business number:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          <div className="footer-link">
            <a href="/delete-owner">탈퇴하시겠습니까?</a>
          </div>
        </div>
      </div>
  );
}

export default UpdateOwner;
