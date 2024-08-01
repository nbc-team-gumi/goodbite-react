import React, { useState, useEffect } from 'react';
import { fetchData } from '../util/api';
import styles from '../styles/Waiting.module.css'; // CSS 모듈 import

function Waiting() {
  const [restaurantId, setRestaurantId] = useState(1);
  const [partySize, setPartySize] = useState(1);
  const [waitingType, setWaitingType] = useState('ONLINE');
  const [demand, setDemand] = useState('');
  const [message, setMessage] = useState('');
  const [waitingCount, setWaitingCount] = useState(0);

  // Function to fetch waiting count
  const fetchWaitingCount = async () => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}/last-waiting`);
      setWaitingCount(response.data); // Assuming the API returns { data: 1 }
    } catch (error) {
      console.error('Failed to fetch waiting count:', error);
    }
  };

  // useEffect to fetch waiting count when component mounts or restaurantId changes
  useEffect(() => {
    fetchWaitingCount();
  }, [restaurantId]);

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    try {
      const requestBody = {
        restaurantId,
        partySize,
        waitingType,
      };

      // demand가 비어 있지 않은 경우에만 requestBody에 추가
      if (demand) {
        requestBody.demand = demand;
      }

      const data = await fetchData('/waitings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      setMessage(`waiting 등록 성공: ${JSON.stringify(data)}`);
      // Re-fetch waiting count after successful registration
      fetchWaitingCount();
    } catch (error) {
      setMessage(`waiting 등록 실패: ${error.message}`);
    }
  };

  return (
      <div>
        <h1>waiting</h1>
        <form onSubmit={handleSignup}>
          <div className={styles.waitingCountBox}>
            <div>현재 대기중인 팀</div>
            <div className={styles.waitingCount} id="waiting-count">{waitingCount} 팀</div>
          </div>
          <label htmlFor="party-size">인원 수:</label>
          <input
              type="number"
              id="party-size"
              name="partySize"
              required
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className={styles.input}
          />

          <label htmlFor="requirements">요청사항:</label>
          <textarea
              id="requirements"
              name="requirements"
              rows="3"
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              className={styles.textarea}
          ></textarea>

          <div className={styles.waitingTypeContainer}>
            <span>웨이팅 타입:</span>
            <label className={styles.radioLabel}>
              <input
                  type="radio"
                  value="ONLINE"
                  checked={waitingType === 'ONLINE'}
                  onChange={(e) => setWaitingType(e.target.value)}
              />
              온라인
            </label>
            <label className={styles.radioLabel}>
              <input
                  type="radio"
                  value="OFFLINE"
                  checked={waitingType === 'OFFLINE'}
                  onChange={(e) => setWaitingType(e.target.value)}
              />
              오프라인
            </label>
          </div>

          <button type="submit" className={styles.button}>등록</button>
        </form>
        {message && <p>{message}</p>}
      </div>
  );
}

export default Waiting;
