import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../util/api';
import styles from '../styles/Waiting.module.css';

const Waiting = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restaurantIdFromQuery = queryParams.get('restaurantId');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [restaurantId, setRestaurantId] = useState(restaurantIdFromQuery || 1); // 초기값을 쿼리 파라미터로 설정
  const [partySize, setPartySize] = useState(1);
  const [waitingType, setWaitingType] = useState('ONLINE');
  const [demand, setDemand] = useState('');
  const [message, setMessage] = useState('');
  const [waitingCount, setWaitingCount] = useState(0);
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // 모달 컴포넌트
  const Modal = ({ show, onClose, children }) => {
    if (!show) {
      return null;
    }

    return (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              {children}
            </div>
            <button className={styles.closeButton} onClick={onClose}>닫기</button>
          </div>
        </div>
    );
  };

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

      const response = await fetchData('/waitings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (response && response.data && response.data.waitingId) {
        const { waitingId } = response.data;
        setMessage(`waiting 등록을 성공했습니다.`);
        setShowModal(true); // 모달 표시

        // 웨이팅 ID로 SSE 구독 시작
        const eventSource = new EventSource(`${API_BASE_URL}/server-events/subscribe/waiting/${waitingId}`);

        eventSource.onopen = () => {
          console.log(`Successfully subscribed to waitingId: ${waitingId}`);
        };

        eventSource.onmessage = (event) => {
          console.log('Received SSE event:', event.data);
          // 크롬 알림 예시
          new Notification('새 웨이팅 알림', {
            body: event.data,
            icon: '/images/good-bite-logo.png'
          });
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
        };

        // Re-fetch waiting count after successful registration
        await fetchWaitingCount();

        // 모달을 닫은 후 /CustomerWaitingList 페이지로 이동
        setTimeout(() => {
          setShowModal(false);
          navigate('/Waitings');
        }, 2000); // 2초
      } else {
        throw new Error('등록에 실패했습니다.');
      }
    } catch (error) {
      setMessage(`waiting 등록 실패: `+ error.message);
      setShowModal(true);
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
        {message && (
            <Modal show={showModal} onClose={() => setShowModal(false)}>
              <p>{message}</p>
            </Modal>
        )}
      </div>
  );
}

export default Waiting;
