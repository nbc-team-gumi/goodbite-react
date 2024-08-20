import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate를 import
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchData } from '../util/api';
import '../styles/Reservation.css';
import styled from "styled-components";

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

const Reservation = () => {
  const { restaurantId } = useParams(); // URL에서 restaurantId를 가져옴
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuPage, setMenuPage] = useState(0);
  const [menuTotalPages, setMenuTotalPages] = useState(1);
  const [operatingHour, setOperatingHour] = useState([]);
  const [reservationDetails, setReservationDetails] = useState({
    date: null,
    time: null,
    partySize: '',
    requirement: '',
    selectedMenus: {}
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMenuList = async (restaurantId, page = 0) => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}/menus?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.statusCode === 200) {
        setMenuItems(response.data.content);
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
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        const data = await fetchData(`/restaurants/${restaurantId}`);
        setRestaurant(data);

        await fetchMenuList(restaurantId);
        await fetchRestaurantOperatingHour(restaurantId);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setMenuItems([]); // 오류 발생 시 메뉴를 빈 배열로 설정
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

    fetchRestaurantData();
  }, [restaurantId]);



  const handleMenuSelect = (menuId) => {
    setReservationDetails((prevDetails) => {
      const selectedMenus = { ...prevDetails.selectedMenus };
      if (selectedMenus[menuId]) {
        delete selectedMenus[menuId];
      } else {
        selectedMenus[menuId] = 1; // 기본 수량은 1로 설정
      }
      return { ...prevDetails, selectedMenus };
    });
  };

  const handleQuantityChange = (menuId, quantity) => {
    setReservationDetails((prevDetails) => ({
      ...prevDetails,
      selectedMenus: {
        ...prevDetails.selectedMenus,
        [menuId]: quantity,
      },
    }));
  };

  const getKoreanType = (type) => {
    const types = {
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

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    // 서울 시간대에 맞춰 날짜와 시간을 변환
    const formattedDate = reservationDetails.date.toLocaleDateString('en-CA'); // YYYY-MM-DD 형식
    const formattedTime = reservationDetails.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // 24시간 형식의 HH:mm

    let message = '1234'; // 기본 오류 메시지

    try {
      const response = await fetchData('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          restaurantId: restaurantId,
          date: formattedDate,
          time: formattedTime,
          partySize: reservationDetails.partySize,
          requirement: reservationDetails.requirement,
          menus: reservationDetails.selectedMenus
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // response에서 statusCode와 message를 가져오는 방법을 확인합니다.
      const { statusCode, message: responseMessage } = response;

      if (statusCode === 200) {
        alert('예약이 완료되었습니다. ' + (responseMessage || ''));
        navigate(-1); // 이전 페이지로 이동
      } else {
        alert('예약에 실패했습니다. ' + (responseMessage || '') + ' 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('예약 중 오류가 발생했습니다:', error);
      alert(error + '\n 다시 시도해주세요.');
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

  return (
      <div className="reservation-container">
        {restaurant && (
            <>
              <h1>{restaurant.name} 예약하기</h1>
              <table>
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
              </table>
              <form onSubmit={handleReservationSubmit}>
                <label>
                  <Asterisk>*</Asterisk> 날짜:
                  <DatePicker
                      selected={reservationDetails.date}
                      onChange={(date) => setReservationDetails({ ...reservationDetails, date })}
                      dateFormat="yyyy-MM-dd"
                      required
                  />
                </label>
                <label>
                  <Asterisk>*</Asterisk> 시간:
                  <DatePicker
                      selected={reservationDetails.time}
                      onChange={(time) => setReservationDetails({ ...reservationDetails, time })}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30} // 30분 간격
                      timeCaption="Time"
                      dateFormat="HH:mm" // 24시간 형식으로 표시
                      required
                  />
                </label>
                <label>
                  <Asterisk>*</Asterisk> 인원수:
                  <select
                      value={reservationDetails.partySize}
                      onChange={(e) =>
                          setReservationDetails({ ...reservationDetails, partySize: e.target.value })
                      }
                      required
                  >
                    {[1, 2, 3, 4, 5, 6].map((size) => (
                        <option key={size} value={size}>
                          {size}명
                        </option>
                    ))}
                  </select>
                </label>
                <label>
                  요청사항:
                  <textarea
                      value={reservationDetails.requirement}
                      onChange={(e) =>
                          setReservationDetails({ ...reservationDetails, requirement: e.target.value })
                      }
                  />
                </label>
                <h3>메뉴 선택</h3>
                <div className="menu-list">
                  {menuItems.length > 0 ? (
                      menuItems.map((item) => (
                          <div key={item.menuId} className="menu-item">
                            <input
                                type="checkbox"
                                id={`menu-${item.menuId}`}
                                onChange={() => handleMenuSelect(item.menuId)}
                                checked={reservationDetails.selectedMenus[item.menuId] || false}
                            />
                            <label htmlFor={`menu-${item.menuId}`}>
                              <img src={item.imageUrl} alt={item.name} width="100%" height="150" />
                              {item.name} - {item.price}원
                            </label>
                            {reservationDetails.selectedMenus[item.menuId] && (
                                <select
                                    value={reservationDetails.selectedMenus[item.menuId]}
                                    onChange={(e) =>
                                        handleQuantityChange(item.menuId, e.target.value)
                                    }
                                >
                                  <option value="">수량</option>
                                  {[...Array(10).keys()].map((n) => (
                                      <option key={n + 1} value={n + 1}>
                                        {n + 1}
                                      </option>
                                  ))}
                                </select>
                            )}
                          </div>
                      ))
                  ) : (
                      <p>메뉴가 없습니다.</p>
                  )}
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
                <button type="submit" className="reservation-submit-button">
                  예약 완료
                </button>
              </form>
            </>
        )}
      </div>
  );
};

export default Reservation;
