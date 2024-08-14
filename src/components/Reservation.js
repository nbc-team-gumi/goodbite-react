import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchData } from '../util/api';
import '../styles/Reservation.css';

const Reservation = () => {
  const { restaurantId } = useParams(); // URL에서 restaurantId를 가져옴
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reservationDetails, setReservationDetails] = useState({
    date: null,
    time: null,
    partySize: '',
    requirement: '',
    selectedMenus: {}
  });

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await fetchData(`/restaurants/${restaurantId}`);
        setRestaurant(data);

        const menuData = await fetchData(`/restaurants/${restaurantId}/menus`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // menuData가 배열인지 확인하고, 배열이 아니면 빈 배열로 초기화
        setMenuItems(Array.isArray(menuData.data) ? menuData.data : []);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setMenuItems([]); // 오류 발생 시 메뉴를 빈 배열로 설정
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

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    // 서울 시간대에 맞춰 날짜와 시간을 변환
    const formattedDate = reservationDetails.date.toLocaleDateString('en-CA'); // YYYY-MM-DD 형식
    const formattedTime = reservationDetails.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // 24시간 형식의 HH:mm

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

      console.log(response.statusCode);
      if (response.statusCode === 200) {
        alert('예약이 완료되었습니다.');
      } else {
        alert('예약에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('예약 중 오류가 발생했습니다:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
      <div className="reservation-container">
        {restaurant && (
            <>
              <h1>{restaurant.name} 예약하기</h1>
              <form onSubmit={handleReservationSubmit}>
                <label>
                  날짜:
                  <DatePicker
                      selected={reservationDetails.date}
                      onChange={(date) => setReservationDetails({ ...reservationDetails, date })}
                      dateFormat="yyyy-MM-dd"
                      required
                  />
                </label>
                <label>
                  시간:
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
                  인원수:
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
                <div className="menu-selection">
                  <h3>메뉴 선택</h3>
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
                              <img src={item.img} alt={item.name} width="50" height="50" />
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