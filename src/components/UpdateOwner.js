import React, { useState, useEffect } from 'react';
import '../styles/UpdateOwner.module.css';
import { fetchData } from '../util/api';
import {useNavigate} from "react-router-dom";
import {useUser} from "../UserContext";

function UpdateOwner() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { role, setRole } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData('/owners', {
          method: 'GET',
        });
        setNickname(response.data.nickname);
        setPhoneNumber(response.data.phoneNumber);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetchData('/users/logout', {
        method: 'POST',
      });

      setRole(null);
      navigate('/restaurants');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const updatePassword = async () => {
    try {
      await fetchData('/owners/password', {
        method: 'PATCH',
        body: JSON.stringify({   "currentPassword": currentPassword,
          "newPassword": newPassword }),
      });
      alert('비밀번호가 수정되었습니다. 다시 로그인해주세요.');
      await handleLogout();
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

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
          </form>
          <div className="footer-link">
            <a href="/delete-owner">탈퇴하시겠습니까?</a>
          </div>
        </div>
      </div>
  );
}

export default UpdateOwner;
