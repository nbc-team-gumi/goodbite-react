import '../styles/RestaurantDetail.css';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../util/api';
import { useNavigate, useParams } from "react-router-dom";

function OwnerRestaurantDetail() {
  const { restaurantId: paramRestaurantId } = useParams();
  const [restaurantId, setRestaurantId] = useState(paramRestaurantId || null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatingHour, setOperatingHour] = useState([]);
  const [menu, setMenu] = useState([]);
  const [menuPage, setMenuPage] = useState(0);
  const [menuTotalPages, setMenuTotalPages] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        let currentRestaurantId = restaurantId;

        if (!restaurantId) {
          // Fetch restaurantId from /restaurants/my if not provided in URL
          const response = await fetchData('/restaurants/my', {
            method: 'GET',
          });
          currentRestaurantId = response.data.restaurantId;
          setRestaurantId(currentRestaurantId);
        }

        await Promise.all([
          fetchRestaurant(currentRestaurantId),
          fetchRestaurantOperatingHour(currentRestaurantId),
          fetchMenuList(currentRestaurantId, 0), // 초기 페이지는 0으로 설정
          fetchReviews(currentRestaurantId, 0), // 초기 페이지는 0으로 설정
        ]);

        setApiSuccess(true);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setApiSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const fetchRestaurant = async (restaurantId) => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.statusCode === 200) {
        setRestaurant(response.data);
      } else {
        throw new Error(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
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
        throw new Error(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    }
  };

  const fetchMenuList = async (restaurantId, page) => {
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
        throw new Error(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    }
  };

  const fetchReviews = async (restaurantId, page) => {
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

  const navigateToUpdateRestaurant = () => {
    navigate(`/update-restaurant/${restaurantId}`);
  };

  const navigateToRegisterOperatingHour = () => {
    navigate(`/register-operatinghour/${restaurantId}`);
  };

  const navigateToRegisterMenu = () => {
    navigate(`/register-menu/${restaurantId}`);
  };

  const navigateToUpdateOperatingHour = (operatingHourId) => {
    navigate(`/update-operatinghour/${operatingHourId}`);
  };

  const navigateToUpdateMenu = (menuId) => {
    navigate(`/update-menu/${menuId}`);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!restaurant) {
    return <div>No restaurant details available</div>;
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

  return (
      <div className="container">
        <header className="header">
          <div className="logo">GOOD BITE</div>
          <nav className="nav-menu">
            <a href="/dashboard">홈</a>
            <a href="/owners">마이페이지</a>
          </nav>
        </header>
        <div className="content">
          <div className="shop-info">
            <h2>{restaurant.name}<p><button className="update-button" onClick={navigateToUpdateRestaurant}>정보 수정하기</button></p></h2>
            <div className="shop-image" style={{ backgroundImage: `url(${restaurant.imageUrl})` }}></div>
            <div className="rating">
              ★★★★☆ <span className="review-count">(리뷰 {reviews.length}개)</span>
            </div>
            <p>{getKoreanType(restaurant.category)}</p>
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
                <th>영업시간<button className="add-button" onClick={navigateToRegisterOperatingHour}>추가하기</button></th>
                <td>
                  {operatingHour.map((hour, index) => (
                      <div key={index} className="operating-hour-row">
                        {getKoreanType(hour.dayOfWeek)}: {hour.openTime} - {hour.closeTime}
                        <button className="btn-hour-update" onClick={() => navigateToUpdateOperatingHour(hour.operatingHourId)}>수정하기</button>
                      </div>
                  ))}
                </td>
              </tr>
              </tbody>
            </table>

            <h3>메뉴 <button className="add-button" onClick={navigateToRegisterMenu}>추가하기</button></h3>
            <div className="menu-list">
              {menu.map((item, index) => (
                  <div key={index} className="menu-item">
                    <img src={item.imageUrl} alt={item.name} width="100%" height="150" />
                    <button className="btn-menu-update" onClick={() => navigateToUpdateMenu(item.menuId)}>수정하기</button>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">{item.price}원</p>
                  </div>
              ))}
            </div>
            <div className="pagination">
              <button onClick={() => handleMenuPageChange(menuPage - 1)} disabled={menuPage <= 0}>이전</button>
              <span>{menuPage + 1} / {menuTotalPages}</span>
              <button onClick={() => handleMenuPageChange(menuPage + 1)} disabled={menuPage >= menuTotalPages - 1}>다음</button>
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
            <div className="pagination">
              <button onClick={() => handleReviewPageChange(reviewPage - 1)} disabled={reviewPage <= 0}>이전</button>
              <span>{reviewPage + 1} / {reviewTotalPages === 0 ? reviewTotalPages + 1 : reviewTotalPages}</span>
              <button onClick={() => handleReviewPageChange(reviewPage + 1)} disabled={reviewPage >= reviewTotalPages - 1}>다음</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default OwnerRestaurantDetail;