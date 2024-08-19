import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../util/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/RestaurantList.css';
import { useUser } from '../UserContext';
import logo from '../images/good-bite-logo.png';
import { locations, getAllSido } from '../util/locations';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterSubLocation, setFilterSubLocation] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [waitingIds, setWaitingIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { role, setRole, setEventSource, logout } = useUser();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async (page) => {
    setLoading(true);
    try {
      const data = await fetchData(`/restaurants?page=${page}`);
      if (data && data.data.content && Array.isArray(data.data.content)) {
        setRestaurants(data.data.content);
        setCurrentPage(data.data.number);
        setTotalPages(data.data.totalPages);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchRestaurants(page); // 페이지 변경 시 해당 페이지 데이터 로드
    }
  };

  useEffect(() => {
    const fetchAllWaitings = async () => {
      let page = 0;
      let allWaitingIds = [];
      while (true) {
        try {
          const response = await fetchData(`/waitings?page=${page}`);
          if (response && response.data && Array.isArray(response.data.content)) {
            const currentPageWaitings = response.data.content;
            const validWaitingIds = currentPageWaitings
            .filter(waiting => waiting.waitingOrder !== null)
            .map(waiting => waiting.waitingId);

            if (validWaitingIds.length === 0 && response.data.last) {
              break;
            }

            allWaitingIds = allWaitingIds.concat(validWaitingIds);
            page += 1;
          } else {
            throw new Error('Invalid data format received from server');
          }
        } catch (error) {
          console.error('Error fetching waitings:', error);
          break;
        }
      }

      setWaitingIds(allWaitingIds);
    };

    if (role === 'ROLE_CUSTOMER') {
      fetchAllWaitings();
    }
  }, [role]);

  useEffect(() => {
    // 알림 권한 요청
    const requestNotificationPermission = () => {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission !== 'granted') {
            console.error('알림 권한이 없습니다.(시크릿모드 확인)');
          }
        });
      }
    };

    requestNotificationPermission();

    const setupSSEConnections = (waitingIds) => {
      waitingIds.forEach(waitingId => {
        const eventSource = new EventSource(`${API_BASE_URL}/server-events/subscribe/waiting/${waitingId}`);

        eventSource.onopen = () => {
          console.log(`Successfully subscribed to waitingId: ${waitingId}`);
        };

        eventSource.onmessage = (event) => {
          console.log('Received SSE event:', event.data);

          // SSE 메시지에서 알림 생성
          if (Notification.permission === 'granted') {
            new Notification('새 웨이팅 알림', {
              body: event.data,  // 받은 메시지를 알림 내용으로 사용
              icon: logo  // Optional: 아이콘 경로
            });
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
        };

        setEventSource(eventSource); // EventSource를 context에 설정
      });
    };

    if (waitingIds.length > 0) {
      setupSSEConnections(waitingIds);
    }

    return () => {
      // Cleanup logic handled by UserContext
    };
  }, [waitingIds, setEventSource]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderRestaurants = (restaurantsToRender) => {
    return restaurantsToRender.map(restaurant => (
        <div
            key={restaurant.restaurantId}
            className="restaurant-card"
            onClick={() => navigate(`/restaurants/${restaurant.restaurantId}`)} // 카드 클릭 시 상세 페이지로 이동
        >
          <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-image" />
          <div className="restaurant-info">
            <h2 className="restaurant-name">{restaurant.name}</h2>
            <p className="restaurant-type">{getKoreanType(restaurant.category)}</p>
            <div className="buttons-container">
              <button
                  className="reservation-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모의 클릭 이벤트 전파를 막기 위해 추가
                    handleReservationClick(restaurant);
                  }}
              >
                예약하기
              </button>
              <button
                  className="waiting-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모의 클릭 이벤트 전파를 막기 위해 추가
                    handleWaitingClick(restaurant);
                  }}
              >
                웨이팅 등록
              </button>
            </div>
          </div>
        </div>
    ));
  };

  const getKoreanType = (type) => {
    const types = {
      korean: "한식",
      italian: "이탈리안",
      japanese: "일식",
      chinese: "중식",
      seafood: "해산물",
      bbq: "바베큐"
    };
    return types[type] || type;
  };

  const filterRestaurants = () => {
    if (!Array.isArray(restaurants)) {
      console.error('restaurants is not an array:', restaurants);
      return [];
    }
    return restaurants.filter(restaurant => {
      const nameMatch = restaurant.name.toLowerCase().includes(
          searchTerm.toLowerCase());
      const locationMatch = filterLocation === 'all' || restaurant.sido
          === filterLocation;
      const subLocationMatch = filterSubLocation === 'all'
          || (restaurant.sigungu && restaurant.sigungu.includes(filterSubLocation));
      const typeMatch = filterType === 'all' || restaurant.category
          === filterType;
      const ratingMatch = filterRating === 'all' || restaurant.rating
          >= parseFloat(filterRating);
      return nameMatch && locationMatch && subLocationMatch && typeMatch
          && ratingMatch;
    });
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFilterLocation(selectedLocation);
    setFilterSubLocation('all');
  };

  const handleUserIconClick = () => {
    if (role === 'ROLE_OWNER') {
      navigate('/owners');
    } else if (role === 'ROLE_CUSTOMER') {
      navigate('/customers');
    }
  };

  const handleReservationClick = (restaurant) => {
    if (role === 'ROLE_CUSTOMER') {
      navigate(`/restaurants/${restaurant.restaurantId}/reservation`);
    } else if (role === 'ROLE_OWNER') {
      alert('손님 유저만 예약할 수 있습니다.');
    } else {
      navigate('/login');
    }
  };

  const handleWaitingClick = (restaurant) => {
    if (role === 'ROLE_CUSTOMER') {
      navigate(`/waiting?restaurantId=${restaurant.restaurantId}`);
    } else if (role === 'ROLE_OWNER') {
      alert('손님 유저만 등록할 수 있습니다.');
    } else {
      navigate('/login');
    }
  }

  const handleLogout = async () => {
    try {
      await logout(); // Logout through UserContext
      navigate('/restaurants');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
      <div>
        <div className="header">
          <h1>GoodBite</h1>
          <p>당신의 완벽한 식사를 위한 간편한 예약 서비스</p>
          <div className="header-buttons">
            {role ? (
                <>
                  <FontAwesomeIcon
                      icon={faUser}
                      className="user-icon"
                      onClick={handleUserIconClick}
                  />
                  {role === 'ROLE_OWNER' ? (
                      <button
                          className="view-waitings-button"
                          onClick={() => navigate('/dashboard')}
                      >
                        대시보드
                      </button>
                  ) : (
                      <>
                        <button
                            className="view-waitings-button"
                            onClick={() => navigate('/waitings')}
                        >
                          내 웨이팅 보기
                        </button>
                        <button
                            className="view-reservations-button" // 내 예약 보기 버튼 추가
                            onClick={() => navigate('/reservations')}
                        >
                          내 예약 보기
                        </button>
                        <button
                            className="view-waitings-button"
                            onClick={() => navigate('/my-reviews')}
                        >
                          내가 쓴 리뷰
                        </button>
                      </>
                  )}
                  <button
                      className="logout-button"
                      onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </>
            ) : (
                <button
                    className="login-button"
                    onClick={() => navigate('/login')}
                >
                  로그인
                </button>
            )}
          </div>
        </div>
        <div className="container">
          <div className="search-filter">
            <div className="filter-dropdowns">
              <select
                  id="filterLocation"
                  value={filterLocation}
                  onChange={handleLocationChange}
              >
                <option value="all">모든 위치</option>
                {getAllSido().map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                ))}
              </select>
              <select
                  id="filterSubLocation"
                  value={filterSubLocation}
                  onChange={e => setFilterSubLocation(e.target.value)}
                  disabled={filterLocation === 'all'}
              >
                <option value="all">모든 세부 위치</option>
                {filterLocation !== 'all' && locations[filterLocation].map(
                    subLocation => (
                        <option key={subLocation} value={subLocation}>
                          {subLocation}
                        </option>
                    ))}
              </select>
              <select
                  id="filterType"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">모든 종류</option>
                <option value="KOREAN">한식</option>
                <option value="WESTERN">양식</option>
                <option value="JAPANESE">일식</option>
                <option value="CHINESE">중식</option>
                <option value="ASIAN">아시안</option>
                <option value="BUNSIK">분식</option>
                <option value="PIZZA">피자</option>
                <option value="CHICKEN">치킨</option>
                <option value="BURGER">버거</option>
                <option value="CAFE">카페/디저트</option>
              </select>
              <select
                  id="filterRating"
                  value={filterRating}
                  onChange={e => setFilterRating(e.target.value)}
              >
                <option value="all">모든 평점</option>
                <option value="4.0">4.0 이상</option>
                <option value="3.0">3.0 이상</option>
                <option value="2.0">2.0 이상</option>
                <option value="1.0">1.0 이상</option>
              </select>
            </div>
            <div className="search-bar">
              <input
                  type="text"
                  id="searchInput"
                  placeholder="식당 이름 검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="restaurant-grid">
            {renderRestaurants(filterRestaurants())}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
              이전
            </button>
            <span>
              페이지 {currentPage + 1} / {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
              다음
            </button>
          </div>
        </div>
      </div>
  );
};

export default RestaurantList;
