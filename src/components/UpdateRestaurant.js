import React, {useEffect, useState} from 'react';
import {fetchData} from '../util/api';
import styled from 'styled-components';
import {useNavigate, useParams} from "react-router-dom";

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  background-color: #ff9800;
  color: white;
  padding: 10px 0;
  text-align: center;
`;

const Form = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const SubmitBtn = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #f57c00;
  }
`;


function UpdateRestaurant() {
  const { restaurantId } = useParams();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageUrl(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetchData(`/restaurants/${restaurantId}`, {
          method: 'GET',
        });
        setName(response.data.name);
        setImageUrl(response.data.imageUrl);
        setAddress(response.data.address);
        setArea(response.data.area);
        setPhoneNumber(response.data.phoneNumber);
        setCategory(response.data.category);
        setCapacity(response.data.capacity);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    const formData = new FormData();
    formData.append('restaurantRequestDto', new Blob([JSON.stringify({
      name,
      address,
      area,
      phoneNumber,
      category,
      capacity
    })], { type: 'application/json' }));
    if (imageUrl) {
      formData.append('image', imageUrl);
    }
    try {
      await fetchData(`/restaurants/${restaurantId}`, {
        method: 'PUT',
        body: formData,
      });
      alert('가게 수정이 완료되었습니다!');
      navigate(`/owner-restaurant-detail/${restaurantId}`);
    } catch (error) {
      alert('가게 수정 실패');
      navigate(`/owner-restaurant-detail/${restaurantId}`);
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

  return (
      <div className="container">
        <Header>
          <h1 style={{color: 'white'}}>GOOD BITE - 가게 수정</h1>
        </Header>
        <Container>
          <Form id="store-register-form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="store-name">가게 이름<Asterisk>*</Asterisk></Label>
              <Input
                  id="store-name"
                  name="storeName"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-area">지역<Asterisk>*</Asterisk></Label>
              <Input
                  id="store-area"
                  name="storeArea"
                  required
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-address">가게 주소<Asterisk>*</Asterisk></Label>
              <Input
                  id="store-address"
                  name="storeAddress"
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-phonenumber">가게 전화번호<Asterisk>*</Asterisk></Label>
              <Input
                  id="store-phonenumber"
                  name="storePhoneNumber"
                  required
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-category">카테고리<Asterisk>*</Asterisk></Label>
              <select
                  id="store-category"
                  name="storeCategory"
                  required
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">카테고리 선택</option>
                <option value="KOREAN">한식</option>
                <option value="JAPANESE">일식</option>
                <option value="CHINESE">중식</option>
                <option value="WESTERN">양식</option>
                <option value="ASIAN">아시안</option>
                <option value="BUNSIK">분식</option>
                <option value="PIZZA">피자</option>
                <option value="CHICKEN">치킨</option>
                <option value="BURGER">버거</option>
                <option value="CAFE">카페,디저트</option>
              </select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-capacity">수용 인원<Asterisk>*</Asterisk></Label>
              <Input
                  id="store-capacity"
                  name="capacity"
                  required
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-photo">가게 사진</Label>
              <Input
                  accept="image/*"
                  id="store-photo"
                  name="imageUrl"
                  type="file"
                  onChange={handleFileChange}
              />
              <div id="image-preview">
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />}
              </div>
            </FormGroup>
            <SubmitBtn className="submit-btn" type="submit">가게 수정하기</SubmitBtn>
          </Form>
        </Container>
        {message && <p>{message}</p>}
      </div>
  );
}

export default UpdateRestaurant;