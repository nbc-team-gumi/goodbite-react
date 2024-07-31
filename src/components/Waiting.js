import React, { useState } from 'react';
import { fetchData } from '../util/api';
import styles from '../styles/Waiting.module.css'; // CSS 모듈 import

function Waiting() {
  const [restaurantId] = useState(2);
  const [partySize, setPartySize] = useState(1);
  const [waitingType, setWaitingType] = useState('ONLINE');
  const [demand, setDemand] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    try {
      const data = await fetchData('/waitings', {
        method: 'POST',
        body: JSON.stringify({
          restaurantId,
          partySize,
          waitingType,
          demand
        }),
      });
      setMessage(`waiting 등록 성공: ${JSON.stringify(data)}`);
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
            <div className={styles.waitingCount} id="waiting-count"></div>
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
              required
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
