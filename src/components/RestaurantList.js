import React, { useState, useEffect } from 'react';
import { fetchData } from '../util/api'; // 기존 유틸리티 함수 임포트
import '../styles/RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await fetchData('/restaurants'); // getAllRestaurants 엔드포인트 호출
        setRestaurants(data.data); // DataResponseDto의 data 필드를 사용
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const renderRestaurants = (restaurantsToRender) => {
    return restaurantsToRender.map(restaurant => (
        <div key={restaurant.restaurantId} className="restaurant-card">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-image" />
          <div className="restaurant-info">
            <h2 className="restaurant-name">{restaurant.name}</h2>
            <p className="restaurant-type">{getKoreanType(restaurant.category)}</p>
            <div className="restaurant-rating">
              <span className="stars">{getStars(restaurant.rating)}</span>
              <span className="rating-value">{restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
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

  const getStars = (rating) => {
    return rating ? '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating)) : '☆☆☆☆☆';
  };

  const filterRestaurants = () => {
    const filteredRestaurants = restaurants.filter(restaurant => {
      const nameMatch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || restaurant.category === filterType;
      return nameMatch && typeMatch;
    });
    return filteredRestaurants;
  };

  return (
      <div>
        <div className="header">
          <h1>GoodBite</h1>
          <p>당신의 완벽한 식사를 위한 간편한 예약 서비스</p>
        </div>
        <div className="container">
          <div className="search-filter">
            <div className="search-bar">
              <input
                  type="text"
                  id="searchInput"
                  placeholder="식당 이름 검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select
                  id="filterSelect"
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