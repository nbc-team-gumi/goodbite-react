import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../util/api';
import '../styles/RestaurantDetail.css';
import { useUser } from '../UserContext';

const RestaurantDetail = () => {
  const { restaurantName } = useParams();
  const { role } = useUser();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatingHour, setOperatingHour] = useState([]);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);

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
        setError(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const fetchRestaurantByName = async (name) => {
      setLoading(true);
      try {
        const restaurants = await fetchData('/restaurants');
        const restaurant = restaurants.data.find(r => r.name === name);

        if (restaurant) {
          const response = await fetchData(
              `/restaurants/${restaurant.restaurantId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

          if (response.statusCode === 200) {
            setRestaurant(response.data);
            await fetchRestaurantOperatingHour(restaurant.restaurantId);
            await fetchMenuList(restaurant.restaurantId);
            await fetchReviews(restaurant.restaurantId);
          } else {
            setError(`Unexpected response data: ${response.message}`);
          }
        } else {
          setError('Restaurant not found');
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
        const response = await fetchData(
            `/restaurants/${restaurantId}/operating-hours`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

        if (response.statusCode === 200) {
          // 시간을 hh:mm 형식으로 변환하여 상태를 업데이트
          const formattedHours = response.data.map(hour => ({
            ...hour,
            openTime: hour.openTime.substring(0, 5), // hh:mm:ss -> hh:mm
            closeTime: hour.closeTime.substring(0, 5), // hh:mm:ss -> hh:mm
          }));
          setOperatingHour(formattedHours);
        } else {
          setError(`Unexpected response data: ${response.message}`);
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
          setError(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    fetchRestaurantByName(restaurantName);
  }, [restaurantName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
      <div className="container">
        <header className="header">
          <div className="logo">GOOD BITE</div>
          <nav className="nav-menu">
            <a href="/restaurants">홈</a>
            {role === 'ROLE_OWNER' ? (
                <>
                  <a href="/owners">마이페이지</a>
                  <a href="/dashboard">대시보드</a>
                </>
            ) : role === 'ROLE_CUSTOMER' ? (
                <a href="/customer">마이페이지</a>
            ) : null}
          </nav>
        </header>
        <div className="content">
          <div className="shop-info">
            <h2>{restaurant.name}</h2>
            <div
                className="shop-image"
                style={{
                  backgroundImage: restaurant && restaurant.imageUrl
                      ? `url(${restaurant.imageUrl})`
                      : '',
                }}
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
                    <img src={item.imageUrl} alt={item.name} width="100%" height="150"/>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">{item.price.toLocaleString()}원</p>
                  </div>
              ))}
            </div>

            <h3>리뷰</h3>
            <div className="reviews">
              {reviews.map((review, index) => (
                  <div key={index} className="review">
                    <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <p>{review.content}</p>
                    <p>{review.nickname}</p>
                    <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default RestaurantDetail;
