import React from 'react';
import ReactDOM from 'react-dom/client';

const showPopup = (message, onClose) => {
  const popupContainer = document.createElement('div');
  document.body.appendChild(popupContainer);

  const root = ReactDOM.createRoot(popupContainer);

  const closePopup = () => {
    if (root) {
      root.unmount();
    }
    if (popupContainer && popupContainer.parentNode === document.body) {
      document.body.removeChild(popupContainer);
    }
    if (onClose) {
      onClose();
    }
  };

  const popupElement = (
      <div className="popup-overlay">
        <div className="popup-content">
          <h1>⭐테스트 이벤트⭐</h1>
          <p>✅ Info</p>
          <p>⏰ 기간: 2024-08-14(수) ~ 2024-08-18(일) 23:59 까지</p><br/>
          <p>🔸 저희 서비스는 <b>고객</b>과 <b>사업자</b> 두 종류의 유저로 구성되어있습니다.</p>
          <p>🔸 <b>사업자 가입: 사업자번호가 유효한 경우에만 가입이 가능</b></p>
          <a href="https://moneypin.biz/bizno/" target="_blank">Moneypin 사업자번호
            조회 페이지</a>
          <p>🔸 직접가입없이 서비스를 이용해보고 싶으시다면 하단의 계정을 사용해주세요.</p><br/>

          <h2>일반 사용자 계정</h2>
          <p>test.customerA@email.com</p>
          <p>test.customerB@email.com</p>
          <p>test.customerC@email.com</p>
          <p>test.customerD@email.com</p>
          <p>test.customerE@email.com</p>
          <p>test.customerF@email.com</p>
          <p>test.customerG@email.com</p>
          <p>test.customerH@email.com</p>
          <p>test.customerI@email.com</p>
          <p>test.customerJ@email.com</p>
          <p>test.customerK@email.com</p>
          <h2>사업자 계정</h2>
          <p>test.ownerA@email.com</p>
          <p>test.ownerB@email.com</p>
          <p>test.ownerC@email.com</p>
          <p>test.ownerD@email.com</p>
          <p>test.ownerE@email.com</p>
          <p>test.ownerF@email.com</p>
          <p>test.ownerG@email.com</p>
          <p>test.ownerH@email.com</p>
          <p>test.ownerI@email.com</p>
          <p>test.ownerJ@email.com</p>
          <p>test.ownerK@email.com</p>
          <h2>공통 비밀번호</h2>
          <p>Passw0rd!</p>
          <button onClick={closePopup}>닫기</button>
        </div>
      </div>
  );

  root.render(popupElement);

  return closePopup;
};

export default showPopup;