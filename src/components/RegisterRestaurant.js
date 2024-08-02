import React, {useState} from 'react';
import {fetchData} from '../util/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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


function RegisterRestaurant() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    // console.log(formData);
    try {
      const data = await fetchData('/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          imageUrl,
          address,
          area,
          phoneNumber,
          category
        }),
      });
      alert('가게 등록이 완료되었습니다!');
      setMessage(`Signup successful: ${JSON.stringify(data)}`);
      navigate('/dashboard');
    } catch (error) {
      alert('가게 등록 실패');
      navigate('/dashboard');
    }
  };

  return (
      <div className="container">
        <Header>
          <h1 style={{color: 'white'}}>GOOD BITE - 가게 등록</h1>
        </Header>
        <Container>
          <Form id="store-register-form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="store-name">가게 이름</Label>
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
              <Label htmlFor="store-area">지역</Label>
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
              <Label htmlFor="store-address">가게 주소</Label>
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
              <Label htmlFor="store-phonenumber">가게 전화번호</Label>
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
              <Label htmlFor="store-category">분류</Label>
              <Input
                  id="store-category"
                  name="storeCategory"
                  required
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-photo">가게 사진</Label>
              <Input
                  accept="image/*"
                  id="store-photo"
                  name="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
              />
              {/*<div id="image-preview">*/}
              {/*  {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />}*/}
              {/*</div>*/}
            </FormGroup>
            <SubmitBtn className="submit-btn" type="submit">가게 등록하기</SubmitBtn>
          </Form>
        </Container>
        {message && <p>{message}</p>}
      </div>
  );
}

export default RegisterRestaurant;