import '../styles/RestaurantDetail.css';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../util/api';
import {useNavigate} from "react-router-dom";

function OwnerRestaurantDetail() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatingHour, setOperatingHour] = useState([]);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const response = await fetchData('/restaurants/my', {
          method: 'GET',
        });
        setRestaurantId(response.data.restaurantId);
        setApiSuccess(true);
        fetchRestaurant(response.data.restaurantId);
        fetchRestaurantOperatingHour(response.data.restaurantId);
        fetchMenuList(response.data.restaurantId);
      } catch (error) {
        console.error('Error:', error);
        setApiSuccess(false);
      }
    };

    fetchRestaurantId();
  }, []);

  const fetchRestaurant = async (restaurantId) => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response);

      if (response.statusCode === 200) {
        setRestaurant(response.data);
      } else {
        throw new Error(`Unexpected response data: ${response.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  //
  // fetchRestaurant();

  const fetchRestaurantOperatingHour = async (restaurantId) => {
    try {
      const response = await fetchData(`/restaurants/${restaurantId}/operating-hours`, {
      method: 'GET',
          headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response);

    if (response.statusCode === 200) {
      setOperatingHour(response.data);

    } else {
      throw new Error(`Unexpected response data: ${response.message}`);
    }
  } catch (error) {
    setError(error.message);
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
};
//
// fetchRestaurantOperatingHour();
  const navigateToUpdateRestaurant  = () => {
    navigate(`/update-restaurant/${restaurantId}`); // Navigate to the desired route
  };

  const navigateToRegisterOperatingHour  = () => {
    navigate(`/register-operatinghour/${restaurantId}`); // Navigate to the desired route
  };
  const navigateToRegisterMenu  = () => {
    navigate(`/register-menu/${restaurantId}`); // Navigate to the desired route
  };
  const navigateToUpdateOperatingHour  = (operatingHourId) => {
    navigate(`/update-operatinghour/${operatingHourId}`); // Navigate to the desired route
  };
  const navigateToUpdateMenu  = (menuId) => {
    navigate(`/update-menu/${menuId}`); // Navigate to the desired route
  };

const fetchMenuList = async (restaurantId) => {
  try {
    const response = await fetchData(`/restaurants/${restaurantId}/menus`, {
    method: 'GET',
        headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('Response:', response);

  if (response.statusCode === 200) {
    setMenu(response.data);
  } else {
    throw new Error(`Unexpected response data: ${response.message}`);
  }
} catch (error) {
  setError(error.message);
  console.error('Fetch error:', error);
} finally {
  setLoading(false);
}
};
//
//   fetchMenuList();
// }, [id]);

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
          <a href="/dashboard">홈</a>
          <a href="/mypage">마이페이지</a>
        </nav>
      </header>
      <div className="content">
        <div className="shop-info">
          <h2>{restaurant.name} <button onClick={navigateToUpdateRestaurant}>정보 수정하기</button></h2>
          <div
              className="shop-image"
              style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
          ></div>
          <div className="rating">
            ★★★★☆ <span className="review-count">(리뷰 152개)</span>
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
              <th>영업시간<button onClick={navigateToRegisterOperatingHour}>추가하기</button></th>
              <td>
                {operatingHour.map((hour, index) => (
                    <div key={index}>
                      {hour.dayOfWeek}: {hour.openTime} - {hour.closeTime}
                      <button className="btn-update" onClick={() => navigateToUpdateOperatingHour(hour.operatingHourId)}>수정하기</button>
                    </div>
                ))}
              </td>
            </tr>
            </tbody>
          </table>

          <h3>메뉴 <button onClick={navigateToRegisterMenu}>추가하기</button></h3>
          <div className="menu-list">
            {menu.map((item, index) => (
                <div key={index} className="menu-item">
                  <img src={item.img} alt={item.name} width="100%" height="150" />
                  <button className="btn-update" onClick={() => navigateToUpdateMenu(item.menuId)}>수정하기</button>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="price">{item.price}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
);
}

export default OwnerRestaurantDetail;