import React, { useState } from 'react';
import { fetchData } from "../util/api";
// import './DeactivateUser.css';

function DeactivateOwner() {
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 오류 상태 추가

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setLoading(true);
      fetchData('/owners', {
        method: 'DELETE',
      })
      .then(response => {
        if (response.statusCode === 200) {  // 응답 상태 코드가 200인지 확인
          alert(response.message || '회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
          // 로컬 스토리지에 저장된 역할(role)을 비웁니다.
          localStorage.removeItem('role');
          window.location.href = '/'; // Redirect to homepage or login page after deletion
        } else {
          alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
      })
      .catch(error => {
        console.error('Error deactivating account:', error);
        alert('탈퇴 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
              <button type="submit">탈퇴하기</button>
            </form>
            <div className="cancel-link">
              <a href="/">취소하고 돌아가기</a>
            </div>
          </div>
        </main>
      </div>
  );
}

export default DeactivateOwner;
