import React, {useEffect, useState} from 'react';
import '../styles/UpdateCustomer.css';
import {fetchData} from "../util/api";
import {useNavigate} from "react-router-dom";
import {useUser} from "../UserContext";

function UpdateCustomer() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const navigate = useNavigate();
  const { role, setRole } = useUser();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchData('/customers', {
          method: 'GET',
        });
        setUser(response.data);
        setNickname(response.data.nickname);
        setPhoneNumber(response.data.phoneNumber);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);//추가

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

  const changePassword = async () => {
    try {
      const response = await fetchData('/customers/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "currentPassword":currentPassword,
          "newPassword":newPassword,
        }),
      });

      if (response.statusCode===200) {
        alert('비밀번호가 변경되었습니다.');
        await handleLogout();
      } else {
        alert('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  const changeNickname = async () => {
    try {
      const response = await fetchData('/customers/nickname', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "newNickname": nickname }),
      });

      if (response.statusCode===200) {
        alert('닉네임이 변경되었습니다.');
      } else {
        alert('닉네임 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error changing nickname:', error);
      alert('닉네임 변경 중 오류가 발생했습니다.');
    }
  };

  const changePhoneNumber = async () => {
    try {
      const response = await fetchData('/customers/phone-number', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "newPhoneNumber":phoneNumber }),
      });

      if (response.statusCode===200) {
        alert('휴대폰 번호가 변경되었습니다.');
      } else {
        alert('휴대폰 번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error changing phone number:', error);
      alert('휴대폰 번호 변경 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button type="button" onClick={changePhoneNumber}>
                  휴대폰번호 수정
                </button>
              </div>
            </form>
            <div className="footer-link">
              <a href="/delete-customer">탈퇴하시겠습니까?</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default UpdateCustomer;
