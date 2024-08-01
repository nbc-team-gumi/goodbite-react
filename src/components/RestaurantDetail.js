import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../util/api';
import '../styles/RestaurantDetail.css';

const RestaurantDetail = () => {
  const { restaurantName } = useParams(); // useParams 훅을 사용하여 URL에서 restaurantName 추출
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatingHour, setOperatingHour] = useState([]);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRestaurantByName = async (name) => {
      try {
        const restaurants = await fetchData('/restaurants');
        const restaurant = restaurants.data.find(r => r.name === name);

        if (restaurant) {
          const response = await fetchData(`/restaurants/${restaurant.restaurantId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.statusCode === 200) {
            setRestaurant(response.data);
            // Fetch operating hours, menu, and reviews
            fetchRestaurantOperatingHour(restaurant.restaurantId);
            fetchMenuList(restaurant.restaurantId);
            fetchReviews(restaurant.restaurantId);
          } else {
            throw new Error(`Unexpected response data: ${response.message}`);
          }
        } else {
          throw new Error('Restaurant not found');
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRestaurantOperatingHour = async (restaurantId) => {
      try {
        const response = await fetchData(`/restaurants/${restaurantId}/operating-hours`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setOperatingHour(response.data);
        } else {
          throw new Error(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    const fetchMenuList = async (restaurantId) => {
      try {
        const response = await fetchData(`/restaurants/${restaurantId}/menus`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setMenu(response.data);
        } else {
          throw new Error(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    const fetchReviews = async (restaurantId) => {
      try {
        const response = await fetchData(`/restaurants/${restaurantId}/reviews`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setReviews(response.data);
        } else {
          throw new Error(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    fetchRestaurantByName(restaurantName); // 레스토랑 이름으로 레스토랑 정보 가져오기
  }, [restaurantName]);

  const handleReviewSubmit = async () => {
    try {
      const response = await fetchData('/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.restaurantId,
          content: reviewContent,
          rating: rating,
        }),
      });

      if (response.statusCode === 200) {
        setReviews(prevReviews => [...prevReviews, response.data]);
        setReviewContent('');
        setRating(0);
      } else {
        throw new Error(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div className="container">
        <header className="header">
          <div className="logo">GOOD BITE</div>
          <nav className="nav-menu">
            <a href="/main">홈</a>
            <a href="/mypage">마이페이지</a>
          </nav>
        </header>
        <div className="content">
          <div className="shop-info">
            <h2>{restaurant.name}</h2>
            <div
                className="shop-image"
                style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
            ></div>
            <div className="rating">
              ★★★★☆ <span className="review-count">(리뷰 {reviews.length}개)</span>
            </div>
            <p>{restaurant.category}</p>
            <table>
              <tbody>
              <tr>
                <th>주소</th>
                <td>{restaurant.area} {restaurant.address}</td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>{restaurant.phoneNumber}</td>
              </tr>
              <tr>
                <th>영업시간</th>
                <td>
                  {operatingHour.map((hour, index) => (
                      <div key={index}>
                        {hour.dayOfWeek}: {hour.openTime} - {hour.closeTime}
                      </div>
                  ))}
                </td>
              </tr>
              </tbody>
            </table>

            <h3>메뉴</h3>
            <div className="menu-list">
              {menu.map((item, index) => (
                  <div key={index} className="menu-item">
                    <img src={item.img} alt={item.name} width="100%" height="150" />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">{item.price}</p>
                  </div>
              ))}
            </div>
          </div>

          <div className="review-section">
            <h3>리뷰</h3>
            <div className="review-form">
            <textarea
                placeholder="리뷰 내용을 입력하세요"
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
            />
              <select
                  value={rating}
                  onChange={e => setRating(e.target.value)}
              >
                <option value="0">평점: 0</option>
                <option value="0.5">평점: 0.5</option>
                <option value="1.0">평점: 1.0</option>
                <option value="1.5">평점: 1.5</option>
                <option value="2.0">평점: 2.0</option>
                <option value="2.5">평점: 2.5</option>
                <option value="3.0">평점: 3.0</option>
                <option value="3.5">평점: 3.5</option>
                <option value="4.0">평점: 4.0</option>
                <option value="4.5">평점: 4.5</option>
                <option value="5.0">평점: 5.0</option>
              </select>
              <button onClick={handleReviewSubmit}>리뷰 등록</button>
            </div>

            <div className="review-list">
              {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <p>{review.content}</p>
                    <div>
                      {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < review.rating ? 'filled-star' : 'empty-star'}>
                      ★
                    </span>
                      ))}
                      <span>({review.rating})</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default RestaurantDetail;