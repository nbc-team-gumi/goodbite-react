import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../util/api';
import '../styles/RestaurantDetail.css';

const RestaurantDetail = () => {
  const { restaurantName } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatingHour, setOperatingHour] = useState([]);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);

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
            await fetchRestaurantOperatingHour(restaurant.restaurantId);
            await fetchMenuList(restaurant.restaurantId);
            await fetchReviews(restaurant.restaurantId); // Fetch reviews for the restaurant
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
        const response = await fetchData(`/restaurants/${restaurantId}/operating-hours`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setOperatingHour(response.data);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchData('/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.restaurantId,
          content: newReviewContent,
          rating: newReviewRating,
        }),
      });

      if (response.statusCode === 200) {
        setNewReviewContent('');
        setNewReviewRating(0);
        await fetchReviews(restaurant.restaurantId); // Fetch reviews again after successful submission
      } else {
        setError(`Unexpected response data: ${response.message}`);
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
            <a href="/restaurants">홈</a>
            <a href="/customers">마이페이지</a>
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

            <h3>리뷰</h3>
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <textarea
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  placeholder="리뷰 내용을 입력하세요"
              ></textarea>
              <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(e.target.value)}
              >
                <option value="0">평점: 0</option>
                <option value="0.5">평점: 0.5</option>
                <option value="1">평점: 1</option>
                <option value="1.5">평점: 1.5</option>
                <option value="2">평점: 2</option>
                <option value="2.5">평점: 2.5</option>
                <option value="3">평점: 3</option>
                <option value="3.5">평점: 3.5</option>
                <option value="4">평점: 4</option>
                <option value="4.5">평점: 4.5</option>
                <option value="5">평점: 5</option>
              </select>
              <button type="submit">리뷰 등록</button>
            </form>
            <div className="reviews">
              {reviews.map((review, index) => (
                  <div key={index} className="review">
                    <p>{review.content}</p>
                    <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default RestaurantDetail;