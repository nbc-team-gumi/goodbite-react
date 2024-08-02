import React, {useState} from 'react';
import {fetchData} from '../util/api';
// import { useParams } from 'react-router-dom';
import '../styles/RegisterOperatingHour.css';
import {useNavigate, useParams} from "react-router-dom";
function RegisterOperatingHour() {
  const { restaurantId } = useParams();
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    try {
      await fetchData('/operating-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          dayOfWeek,
          openTime,
          closeTime
        }),
      });
      alert('영업 시간 등록이 완료되었습니다!');
      navigate(`/owner-restaurant-detail/${restaurantId}`);
    } catch (error) {
      alert('영업 시간 등록 실패');
      navigate(`/owner-restaurant-detail/${restaurantId}`);
    }
  };

  return (
      <div className="container">
        <header className="header">
          <h1>GOOD BITE</h1>
        </header>
        <div className="form-wrapper">
          <h2>영업시간 등록</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="day">요일</label>
              <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  required
              >
                <option value="">요일 선택</option>
                <option value="MON">월요일</option>
                <option value="TUE">화요일</option>
                <option value="WED">수요일</option>
                <option value="THU">목요일</option>
                <option value="FRI">금요일</option>
                <option value="SAT">토요일</option>
                <option value="SUN">일요일</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="openTime">오픈 시간</label>
              <input
                  id="openTime"
                  name="openTime"
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="closeTime">마감 시간</label>
              <input
                  id="closeTime"
                  name="closeTime"
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  required
              />
            </div>
            <button type="submit" className="btn">
              영업시간 등록
            </button>
          </form>
        </div>
      </div>
  );
}

export default RegisterOperatingHour;