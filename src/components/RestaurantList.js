import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../util/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/RestaurantList.css';
import { useUser } from '../UserContext';
import logo from '../images/good-bite-logo.png';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterSubLocation, setFilterSubLocation] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [waitingIds, setWaitingIds] = useState([]);
  const navigate = useNavigate();
  const { role, setRole } = useUser();

  const subLocations = {
    seoul: ["마포구", "영등포구", "강남구"],
    gyeonggi: ["성남시", "수원시", "고양시"],
    gangwon: ["춘천시", "원주시", "강릉시"],
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await fetchData('/restaurants');
        if (data && data.data && Array.isArray(data.data)) {
          setRestaurants(data.data);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

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
            console.error('Notification permission denied');
          }
        });
      }
    };

    requestNotificationPermission();

    const setupSSEConnections = (waitingIds) => {
      waitingIds.forEach(waitingId => {
        const eventSource = new EventSource(`http://localhost:8080/server-events/subscribe/waiting/${waitingId}`);

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
      });
    };

    if (waitingIds.length > 0) {
      setupSSEConnections(waitingIds);
    }

    return () => {
      waitingIds.forEach(waitingId => {
        const eventSource = new EventSource(`http://localhost:8080/server-events/subscribe/waiting/${waitingId}`);
        eventSource.close();
      });
    };
  }, [waitingIds]);

  const renderRestaurants = (restaurantsToRender) => {
    return restaurantsToRender.map(restaurant => (
        <div
            key={restaurant.restaurantId}
            className="restaurant-card"
        >
          <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-image" />
          <div className="restaurant-info">
            <h2 className="restaurant-name" onClick={() => navigate(`/restaurants/${restaurant.name}`)}>{restaurant.name}</h2>
            <p className="restaurant-type">{getKoreanType(restaurant.category)}</p>
            <div className="restaurant-rating">
              <span className="stars">{getStars(restaurant.rating)}</span>
              <span className="rating-value">{restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
            </div>
            <button
                className="waiting-button"
                onClick={() => navigate(`/waiting?restaurantId=${restaurant.restaurantId}`)}
            >
              웨이팅 등록
            </button>
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

  const getStars = (rating) => {
    return rating ? '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating)) : '☆☆☆☆☆';
  };

  const filterRestaurants = () => {
    if (!Array.isArray(restaurants)) {
      console.error('restaurants is not an array:', restaurants);
      return [];
    }
    const filteredRestaurants = restaurants.filter(restaurant => {
      const nameMatch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = filterLocation === 'all' || restaurant.area === filterLocation;
      const subLocationMatch = filterSubLocation === 'all' || (restaurant.address && restaurant.address.includes(filterSubLocation));
      const typeMatch = filterType === 'all' || restaurant.category === filterType;
      const ratingMatch = filterRating === 'all' || restaurant.rating >= parseFloat(filterRating);
      return nameMatch && locationMatch && subLocationMatch && typeMatch && ratingMatch;
    });
    return filteredRestaurants;
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
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetchData('/users/logout', {
        method: 'POST',
      });

      setRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

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
                      <button
                          className="view-waitings-button"
                          onClick={() => navigate('/waitings')}
                      >
                        내 웨이팅 보기
                      </button>
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
                <option value="seoul">서울</option>
                <option value="gyeonggi">경기</option>
                <option value="gangwon">강원</option>
              </select>
              <select
                  id="filterSubLocation"
                  value={filterSubLocation}
                  onChange={e => setFilterSubLocation(e.target.value)}
                  disabled={filterLocation === 'all'}
              >
                <option value="all">모든 세부 위치</option>
                {filterLocation !== 'all' && subLocations[filterLocation].map(subLocation => (
                    <option key={subLocation} value={subLocation}>{subLocation}</option>
                ))}
              </select>
              <select
                  id="filterType"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">모든 종류</option>
                <option value="korean">한식</option>
                <option value="italian">이탈리안</option>
                <option value="japanese">일식</option>
                <option value="chinese">중식</option>
                <option value="seafood">해산물</option>
                <option value="bbq">바베큐</option>
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
        </div>
      </div>
  );
};

export default RestaurantList;
