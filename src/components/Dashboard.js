// src/components/Dashboard.js

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
  const [statistics, setStatistics] = useState(null);
  const [waitingList, setWaitingList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWaitingId, setCurrentWaitingId] = useState(null);
  const [currentPartySize, setCurrentPartySize] = useState(0);
  const [currentDemand, setCurrentDemand] = useState('');
  const navigate = useNavigate();
  const { role, setRole, eventSource, setEventSource, logout } = useUser();

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
    const newEventSource = new EventSource(`http://localhost:8080/server-events/subscribe/restaurant/${restaurantId}`);
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
            {apiSuccess ? (
                <>
                  <img
                      src="https://image.ajunews.com/content/image/2019/12/25/20191225170826943516.jpg"
                      alt="Profile" onClick={navigateToMyPage}
                  />
                  <button className="myrestaurant-button" onClick={navigateToMyRestaurant}>내 가게</button>
                </>
            ) : (
                <img
                    src="https://image.ajunews.com/content/image/2019/12/25/20191225170826943516.jpg"
                    alt="Profile"
                />
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
                <StatisticsBox statistics={statistics}/>
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

const StatisticsBox = ({ statistics }) => (
    <div className="statistics-box">
      <h2>오늘의 통계</h2>
      <p>별점, 리뷰 통계</p>
      {/* 실제 통계 데이터를 표시하는 코드 추가 */}
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
