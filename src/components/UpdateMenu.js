import React, {useEffect, useState} from 'react';
import {fetchData} from '../util/api';
import styled from 'styled-components';
import {useNavigate, useParams} from "react-router-dom";

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

const Btn = styled.button`
  background-color: #d40000;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;


function UpdateMenu() {
  const { menuId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetchData(`/menus/${menuId}`, {
          method: 'GET',
        });
        setName(response.data.name);
        setPrice(response.data.price);
        setDescription(response.data.description);
        setImageUrl(response.data.imageUrl)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    // console.log(formData);
    try {
      await fetchData(`/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
          description,
          imageUrl
        }),
      });
      alert('메뉴 수정이 완료되었습니다!');
      navigate('/owner-restaurant-detail');
    } catch (error) {
      alert('메뉴 수정 실패');
      navigate('/owner-restaurant-detail');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await fetchData(`/menus/${menuId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('메뉴가 삭제되었습니다.');
        navigate('/owner-restaurant-detail');
      } catch (error) {
        alert('메뉴 삭제 실패');
        navigate('/owner-restaurant-detail');
      }
    }
  };

  return (
      <div className="container">
        <Header>
          <h1 style={{color: 'white'}}>GOOD BITE - 메뉴 수정</h1>
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
            <FormGroup>
              <Label htmlFor="menu-imageUrl">이미지</Label>
              <Input
                  id="menu-imageUrl"
                  name="menuImageUrl"
                  required
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
              />
            </FormGroup>
            <SubmitBtn className="submit-btn" type="submit">메뉴 수정하기</SubmitBtn>
            <Btn className="btn-danger" type="button" onClick={handleDelete}>메뉴 삭제하기</Btn>
          </Form>
        </Container>
      </div>
  );
}

export default UpdateMenu;