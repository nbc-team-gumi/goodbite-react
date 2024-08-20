import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { fetchData } from '../util/api';
import '../styles/RestaurantDetail.css';
import { useUser } from '../UserContext';
import { renderStars } from '../util/renderStars';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const { role } = useUser();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatingHour, setOperatingHour] = useState([]);
  const [menu, setMenu] = useState([]);
  const [menuPage, setMenuPage] = useState(0);
  const [menuTotalPages, setMenuTotalPages] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchReviews = async (restaurantId, page = 0) => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}/reviews?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.statusCode === 200) {
        setReviews(response.data.content);
        setReviewPage(response.data.number);
        setReviewTotalPages(response.data.totalPages);
      } else {
        setError(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    }
  };

  const fetchMenuList = async (restaurantId, page = 0) => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}/menus?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.statusCode === 200) {
        setMenu(response.data.content);
        setMenuPage(response.data.number);
        setMenuTotalPages(response.data.totalPages);
      } else {
        setError(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const response = await fetchData(`/restaurants/${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setRestaurant(response.data);
          await fetchRestaurantOperatingHour(restaurantId);
          await fetchMenuList(restaurantId);
          await fetchReviews(restaurantId);
        } else {
          setError(`Unexpected response data: ${response.message}`);
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
          const formattedHours = response.data.map(hour => {
            const isNextDay = hour.closeTime < hour.openTime; // Compare times
            return {
              ...hour,
              openTime: hour.openTime.substring(0, 5), // hh:mm:ss -> hh:mm
              closeTime: `${isNextDay ? ' 익일 ' : ''}${hour.closeTime.substring(0, 5)}`, // Append "익일" if necessary
            };
          });
          setOperatingHour(formattedHours);
        } else {
          setError(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleReservationClick = () => {
    if (role === 'ROLE_CUSTOMER') {
      navigate(`/restaurants/${restaurantId}/reservation`);
    } else if (role === 'ROLE_OWNER') {
      alert('손님 유저만 예약할 수 있습니다.');
    } else {
      navigate('/login');
    }
  };

  const handleWaitingClick = () => {
    if (role === 'ROLE_CUSTOMER') {
      navigate(`/waiting?restaurantId=${restaurantId}`);
    } else if (role === 'ROLE_OWNER') {
      alert('손님 유저만 등록할 수 있습니다.');
    } else {
      navigate('/login');
    }
  }

  const getKoreanType = (type) => {
    const types = {
      KOREAN: "한식",
      WESTERN: "양식",
      JAPANESE: "일식",
      CHINESE: "중식",
      ASIAN: "아시안",
      BUNSIK: "분식",
      PIZZA: "피자",
      CHICKEN: "치킨",
      BURGER: "버거",
      CAFE: "카페/디저트",
      MONDAY: "월요일",
      TUESDAY: "화요일",
      WEDNESDAY: "수요일",
      THURSDAY: "목요일",
      FRIDAY: "금요일",
      SATURDAY: "토요일",
      SUNDAY: "일요일"
    };
    return types[type] || type;
  };

  const handleMenuPageChange = (newPage) => {
    if (newPage >= 0 && newPage < menuTotalPages) {
      fetchMenuList(restaurantId, newPage);
    }
  };

  const handleReviewPageChange = (newPage) => {
    if (newPage >= 0 && newPage < reviewTotalPages) {
      fetchReviews(restaurantId, newPage);
    }
  };

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
                <a href="/customers">마이페이지</a>
            ) : null}
          </nav>
        </header>
        <div className="content">
          <div className="shop-info">
            <h2>{restaurant.name}</h2>
            <button
                className="detail-reservation-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReservationClick(restaurant);
                }}
            >
              예약하기
            </button>
            <button
                className="detail-waiting-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWaitingClick(restaurant);
                }}
            >
              웨이팅 등록
            </button>
            <div
                className="shop-image"
                style={{
                  backgroundImage: restaurant && restaurant.imageUrl
                      ? `url(${restaurant.imageUrl})`
                      : '',
                }}
            ></div>
            <div className="rating">
              <span className="stars">{renderStars(restaurant.rating)}</span>
              <span className="restaurant-raintg">{restaurant.rating}</span>
              <span className="review-count">(리뷰 {reviews.length}개)</span>
            </div>
            <p>{getKoreanType(restaurant.category)}</p>
            <table>
              <tbody>
              <tr>
                <th>주소</th>
                <td>{restaurant.address} {restaurant.detailAddress}</td>
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
                        {getKoreanType(hour.dayOfWeek)}: {hour.openTime} - {hour.closeTime}
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
            <div className="pagination">
              <button
                  onClick={() => handleMenuPageChange(menuPage - 1)}
                  disabled={menuPage <= 0}
              >
                이전
              </button>
              <span>페이지 {menuPage + 1} / {menuTotalPages === 0 ? menuTotalPages + 1 : menuTotalPages}</span>
              <button
                  onClick={() => handleMenuPageChange(menuPage + 1)}
                  disabled={menuPage >= menuTotalPages - 1}
              >
                다음
              </button>
            </div>

            <h3>리뷰</h3>
            <div className="reviews">
              {reviews.map((review, index) => (
                  <div key={index} className="review">
                    <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <p>{review.content}</p>
                    <p>{review.nickname}</p>
                    <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
              ))}
            </div>
            <div className="pagination">
              <button
                  onClick={() => handleReviewPageChange(reviewPage - 1)}
                  disabled={reviewPage <= 0}
              >
                이전
              </button>
              <span>페이지 {reviewPage + 1} / {reviewTotalPages === 0 ? reviewTotalPages + 1 : reviewTotalPages}</span>
              <button
                  onClick={() => handleReviewPageChange(reviewPage + 1)}
                  disabled={reviewPage >= reviewTotalPages - 1}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default RestaurantDetail;