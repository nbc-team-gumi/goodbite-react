import React, {useState} from 'react';
import {fetchData} from '../util/api';
import '../styles/RegisterOperatingHour.css';
import {useNavigate, useParams} from "react-router-dom";
function RegisterOperatingHour() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const daysOfWeek = [
    { value: 'MONDAY', label: '월요일' },
    { value: 'TUESDAY', label: '화요일' },
    { value: 'WEDNESDAY', label: '수요일' },
    { value: 'THURSDAY', label: '목요일' },
    { value: 'FRIDAY', label: '금요일' },
    { value: 'SATURDAY', label: '토요일' },
    { value: 'SUNDAY', label: '일요일' },
  ];
  const initialOperatingHours = daysOfWeek.map(day => ({
    dayOfWeek: day.value,
    openTime: '',
    closeTime: '',
  }));
  const [operatingHours, setOperatingHours] = useState(initialOperatingHours);

  const handleChange = (index, field, value) => {
    const updatedHours = [...operatingHours];
    updatedHours[index][field] = value;
    setOperatingHours(updatedHours);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
      const formattedData = operatingHours
      .filter(hour => hour.openTime && hour.closeTime);

      if (formattedData.length === 0) {
        alert('적어도 하루의 영업시간을 입력해주세요.');
        return;
      }
      try {
        // Construct the request body
        const requests = formattedData.map(hour => ({
          restaurantId,
          dayOfWeek: hour.dayOfWeek,
          openTime: `${hour.openTime}`,
          closeTime: `${hour.closeTime}`
        }));

        for (const requestBody of requests) {
          await fetchData('/operating-hours', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
        }

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
            {operatingHours.map((hour, index) => (
                <div key={hour.dayOfWeek} className="day-section">
                  <h3>{daysOfWeek.find(day => day.value === hour.dayOfWeek).label}</h3>
                  <div className="form-group">
                    <label htmlFor={`openTime-${hour.dayOfWeek}`}>오픈 시간</label>
                    <input
                        id={`openTime-${hour.dayOfWeek}`}
                        name={`openTime-${hour.dayOfWeek}`}
                        type="time"
                        value={hour.openTime}
                        onChange={(e) => handleChange(index, 'openTime', e.target.value)}
              />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`closeTime-${hour.dayOfWeek}`}>마감 시간</label>
                    <input
                        id={`closeTime-${hour.dayOfWeek}`}
                        name={`closeTime-${hour.dayOfWeek}`}
                        type="time"
                        value={hour.closeTime}
                        onChange={(e) => handleChange(index, 'closeTime', e.target.value)}
                    />
                  </div>
                </div>
            ))}
            <button type="submit" className="btn">
              영업시간 등록
            </button>
          </form>
        </div>
      </div>
  );
}

export default RegisterOperatingHour;