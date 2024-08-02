import React, {useState} from 'react';
import {fetchData} from '../util/api';
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";

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


function RegisterMenu() {
  const restaurantId = 1;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    // console.log(formData);
    try {
      await fetchData('/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          name,
          price,
          description
        }),
      });
      alert('메뉴 등록이 완료되었습니다!');
      navigate('/restaurant-detail');
    } catch (error) {
      alert('메뉴 등록 실패');
    }
  };

  return (
      <div className="container">
        <Header>
          <h1 style={{color: 'white'}}>GOOD BITE - 메뉴 등록</h1>
        </Header>
        <Container>
          <Form id="store-register-form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="menu-name">메뉴 이름</Label>
              <Input
                  id="menu-name"
                  name="menuName"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="menu-price">가격</Label>
              <Input
                  id="menu-price"
                  name="menuPrice"
                  required
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="menu-description">설명</Label>
              <Input
                  id="menu-description"
                  name="menuDescription"
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <SubmitBtn className="submit-btn" type="submit">메뉴 등록하기</SubmitBtn>
          </Form>
        </Container>
      </div>
  );
}

export default RegisterMenu;