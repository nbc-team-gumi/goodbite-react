import React, { useState } from 'react';
import { fetchData } from '../util/api';
import styled from 'styled-components';
import { useNavigate, useParams } from "react-router-dom";

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

function RegisterMenu() {
  const { restaurantId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    // console.log(formData);
    const formData = new FormData();
    formData.append('createMenuRequestDto', new Blob([JSON.stringify({
      restaurantId,
      name,
      price,
      description
    })], { type: 'application/json' }));
    if (imageUrl) {
      formData.append('image', imageUrl);
    }
    try {
      await fetchData('/menus', {
        method: 'POST',
        body: formData,
      });
      alert('메뉴 등록이 완료되었습니다!');
      navigate(`/owner-restaurant-detail/${restaurantId}`);
    } catch (error) {
      alert('메뉴 등록 실패');
      navigate(`/owner-restaurant-detail/${restaurantId}`);
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
              <Label htmlFor="menu-name">메뉴 이름<Asterisk>*</Asterisk></Label>
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
              <Label htmlFor="menu-price">가격<Asterisk>*</Asterisk></Label>
              <Input
                  id="menu-price"
                  name="menuPrice"
                  required
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
              />
              <p>{price.toLocaleString()} 원</p>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="menu-description">설명<Asterisk>*</Asterisk></Label>
              <Input
                  id="menu-description"
                  name="menuDescription"
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="menu-imageUrl">이미지<Asterisk>*</Asterisk></Label>
              <Input
                  accept="image/*"
                  id="menu-imageUrl"
                  name="imageUrl"
                  type="file"
                  onChange={handleFileChange}
              />
              <div id="image-preview">
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                    />
                )}
              </div>
            </FormGroup>
            <SubmitBtn className="submit-btn" type="submit">메뉴 등록하기</SubmitBtn>
          </Form>
        </Container>
      </div>
  );
}

export default RegisterMenu;
