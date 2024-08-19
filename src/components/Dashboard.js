import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import titleImage from '../images/good-bite-title.png';
import { fetchData } from '../util/api';
import DashboardModal from './Dashboard-modal';
import { useUser } from "../UserContext";
import logo from '../images/good-bite-logo.png';

const Dashboard = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [reservationList, setReservationList] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWaitingId, setCurrentWaitingId] = useState(null);
  const [currentPartySize, setCurrentPartySize] = useState(0);
  const [currentDemand, setCurrentDemand] = useState('');
  const navigate = useNavigate();
  const { role, setRole, eventSource, setEventSource, logout } = useUser();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const response = await fetchData('/restaurants/my', {
          method: 'GET',
        });
        const { restaurantId } = response.data;
        setRestaurantId(restaurantId);
        setApiSuccess(true);
        fetchStatisticsAndWaitingList(restaurantId, 0);
        fetchReservations(restaurantId);
        if (!eventSource) {
          subscribeToRestaurant(restaurantId); // 구독 함수 호출
        }
      } catch (error) {
        console.error('Error:', error);
        setApiSuccess(false);
      }
    };

    fetchRestaurantId();

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log('SSE 연결이 종료되었습니다.');
        setEventSource(null); // Clear the event source from context
      }
    };
  }, [eventSource, setEventSource]);

  const fetchStatisticsAndWaitingList = async (restaurantId, page) => {
    try {
      const waitingListData = await fetchData(
          `/restaurants/${restaurantId}/waitings?page=${page}&size=5`, {
            method: 'GET',
          });
      setWaitingList(waitingListData.data.content);
      setTotalPages(waitingListData.data.totalPages);
    } catch (error) {
      console.error('Error fetching statistics and waiting list:', error);
    }
  };

  const fetchReservations = async (restaurantId) => {
    try {
      const reservationData = await fetchData(
          `/restaurants/${restaurantId}/reservations`, { // No pagination
            method: 'GET',
          });
      setReservationList(reservationData.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (restaurantId !== null) {
      fetchStatisticsAndWaitingList(restaurantId, newPage);
      setPage(newPage);
    }
  };

  const handleAcceptClick = async (waitingId) => {
    const confirmed = window.confirm(
        `Waiting ID: ${waitingId}\n이 요청을 수락하시겠습니까?`);
    if (confirmed) {
      try {
        await fetchData(`/waitings/${waitingId}`, {
          method: 'PUT',
        });
        alert('요청이 성공적으로 수락되었습니다.');
        fetchStatisticsAndWaitingList(restaurantId, page);
      } catch (error) {
        console.error('Error accepting waiting:', error);
        alert('요청 수락 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRejectClick = async (waitingId) => {
    const confirmed = window.confirm(`Waiting ID: ${waitingId}\n거절하시겠습니까?`);
    if (confirmed) {
      try {
        await fetchData(`/waitings/${waitingId}`, {
          method: 'DELETE',
        });
        alert('요청이 성공적으로 거절되었습니다.');
        fetchStatisticsAndWaitingList(restaurantId, page);
      } catch (error) {
        console.error('Error rejecting waiting:', error);
        alert('요청 거절 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancelClick = async (reservationId) => {
    const confirmed = window.confirm(
        `예약 ID: ${reservationId}\n이 예약을 취소하시겠습니까?`);
    if (confirmed) {
      try {
        await fetchData(`/reservations/${reservationId}`, {
          method: 'DELETE',
        });
        alert('예약이 성공적으로 취소되었습니다.');
        // Refetch reservations after cancellation
        if (restaurantId) {
          fetchReservations(restaurantId);
        }
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('예약 취소 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEditClick = (waitingId, partySize, demand) => {
    setCurrentWaitingId(waitingId);
    setCurrentPartySize(partySize);
    setCurrentDemand(demand);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = async (waitingId, partySize, demand) => {
    try {
      await fetchData(`/waitings/${waitingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partySize: partySize,
          demand: demand,
        }),
      });
      alert('수정이 성공적으로 완료되었습니다.');
      fetchStatisticsAndWaitingList(restaurantId, page);
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating waiting:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleClick = () => {
    navigate('/register-restaurant'); // Navigate to the desired route
  };

  const navigateToMyRestaurant = () => {
    navigate(`/owner-restaurant-detail/${restaurantId}`); // Navigate to the desired route
  };

  const navigateToMyPage = () => {
    navigate('/owners'); // Redirect to the desired route
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from context
      navigate('/restaurants');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const subscribeToRestaurant = (restaurantId) => {
    const newEventSource = new EventSource(`${API_BASE_URL}/server-events/subscribe/restaurant/${restaurantId}`);
    setEventSource(newEventSource);

    newEventSource.onopen = (event) => {
      console.log(`Subscribed to restaurant ${restaurantId}`, event);
    };

    newEventSource.onmessage = (event) => {
      console.log(`Message from restaurant ${restaurantId}`, event);
      showNotification(`Restaurant ${restaurantId}`, event.data);
    };

    newEventSource.onerror = (event) => {
      console.error('EventSource failed:', event);
      newEventSource.close();
      setEventSource(null); // Clear the event source from context on error
    };
  };

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: logo });
        }
      });
    }
  };

  return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <Link to="/">
            <img src={titleImage} alt="GOOD BITE" className="title-image"/>
          </Link>
          <div className="profile-icon">
            <Link to="/owners">
              <img
                  src="https://image.ajunews.com/content/image/2019/12/25/20191225170826943516.jpg"
                  alt="Profile"
              />
            </Link>
            {apiSuccess && (
                <button className="myrestaurant-button" onClick={navigateToMyRestaurant}>내 가게</button>
            )}
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </header>
        <main className="dashboard-main">
          {apiSuccess ? (
              <>
                <WaitingListBox
                    waitingList={waitingList}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onAcceptClick={handleAcceptClick}
                    onRejectClick={handleRejectClick}
                    onEditClick={handleEditClick}
                />
                <StatisticsBox
                    reservationList={reservationList}
                    onCancelClick={handleCancelClick}
                />
              </>
          ) : (
              <div className="register-restaurant">
                <p className="register-message">새로운 식당을 등록하세요</p>
                <button className="register-button" onClick={handleClick}>식당을 등록해주세요</button>
              </div>
          )}
          <DashboardModal
              show={modalVisible}
              onClose={handleModalClose}
              onSubmit={handleModalSubmit}
              waitingId={currentWaitingId}
              currentPartySize={currentPartySize}
              currentDemand={currentDemand}
          />
        </main>
      </div>
  );
};

const getKoreanType = (type) => {
  const types = {
    PENDING: "예약 확정 대기중",
    COMPLETED: "완료된 예약",
    CONFIRMED: "확정된 예약",
    CANCELLED: "취소된 예약",
    REJECTED: "거부된 예약"
  };
  return types[type] || type;
};

const StatisticsBox = ({ reservationList = [], onCancelClick }) => (
    <div className="statistics-box">
      <h2>예약 목록</h2>
      <table>
        <thead>
        <tr>
          <th className="date-col">예약 날짜</th>
          <th className="time-col">예약 시간</th>
          <th className="people-col">인원</th>
          <th className="name-col">예약자</th>
          <th className="request-col">요청 사항</th>
          <th className="status-col">예약 상태</th>
          <th>취소</th>
        </tr>
        </thead>
        <tbody>
        {reservationList.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.partySize}</td>
              <td>{reservation.customerId}</td>
              <td>{reservation.requirement}</td>
              <td>{getKoreanType(reservation.status)}</td>
              <td>
                <button onClick={() => onCancelClick(reservation.reservationId)}>취소</button>
              </td>

            </tr>
        ))}
        </tbody>
      </table>
    </div>
);

const WaitingListBox = ({
  waitingList,
  page,
  totalPages,
  onPageChange,
  onAcceptClick,
  onRejectClick,
  onEditClick
}) => (
    <div className="waiting-list-box">
      <h2>오늘의 대기 손님</h2>
      <table>
        <thead>
        <tr>
          <th>번호</th>
          <th>시간</th>
          <th>이름</th>
          <th>인원</th>
          <th>특별 요청</th>
          <th>액션</th>
        </tr>
        </thead>
        <tbody>
        {waitingList.map((guest, index) => (
            <tr key={index}>
              <td>{guest.waitingOrder}</td>
              <td>{new Date(guest.createAt).toLocaleTimeString()}</td>
              <td>{guest.customerNickname}</td>
              <td>{guest.partySize}</td>
              <td>{guest.demand}</td>
              <td>
                {guest.waitingStatus === 'WAITING' && (
                    <>
                      <button className="accept-button" onClick={() => onAcceptClick(guest.waitingId)}>수락</button>
                      <button className="reject-button" onClick={() => onRejectClick(guest.waitingId)}>거절</button>
                      <button className="edit-button" onClick={() => onEditClick(guest.waitingId, guest.partySize, guest.demand)}>수정</button>
                    </>
                )}
                {guest.waitingStatus === 'SEATED' && <span className="accepted-text">수락됨</span>}
                {guest.waitingStatus === 'CANCELLED' && <span className="cancelled-text">거절됨</span>}
              </td>
            </tr>
        ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 0}>이전</button>
        <span>{page + 1} / {totalPages}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>다음</button>
      </div>
    </div>
);

export default Dashboard;
