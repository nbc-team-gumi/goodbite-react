import React, {useEffect, useState} from 'react';
import {fetchData} from '../util/api';
import { useParams } from 'react-router-dom';
import '../styles/RegisterOperatingHour.css';

const dayOfWeekMapping = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

function UpdateOperatingHour() {
  const { id } = useParams();
  const [operatingHour, setOperatingHour] = useState(null);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchOperatinghour = async () => {
    try {
      const response = await fetchData(`/operating-hours/2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response);

      if (response.statusCode === 200) {
        setOperatingHour(response.data);
      } else {
        throw new Error(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOperatinghour();
}, [id]);

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    try {
      await fetchData('/operating-hours/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // dayOfWeek,
          openTime,
          closeTime
        }),
      });
      alert('영업 시간 수정이 완료되었습니다!');
    } catch (error) {
      alert('영업 시간 수정 실패');
    }
  };

  const koreanDayOfWeek = operatingHour ? dayOfWeekMapping[operatingHour.dayOfWeek] : '';

  return (
      <div className="container">
        <header className="header">
          <h1>GOOD BITE</h1>
        </header>
        <div className="form-wrapper">
          <h2>영업시간 수정</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="day">{koreanDayOfWeek ? `${koreanDayOfWeek}요일` : '요일'}</label>
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
              영업시간 수정
            </button>
          </form>
        </div>
      </div>
  );
}

export default UpdateOperatingHour;