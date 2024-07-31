import React from 'react';
import '../styles/Dashboard.css';
import titleImage from '../images/good-bite-title.png';

const Dashboard = () => {
  return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <img src={titleImage} alt="GOOD BITE" className="title-image" />
          <div className="profile-icon">
            <img src="https://image.ajunews.com/content/image/2019/12/25/20191225170826943516.jpg" alt="Profile" />
          </div>
        </header>
        <main className="dashboard-main">
          <div className="register-restaurant">
            <p className="register-message">새로운 식당을 등록하세요</p>
            <button className="register-button">식당을 등록해주세요</button>
          </div>
        </main>
      </div>
  );
};

export default Dashboard;
