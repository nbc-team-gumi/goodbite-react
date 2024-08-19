import React, { useState } from 'react';
import { fetchData } from '../util/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';

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

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AddressInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ddd; /* 기본 색상으로 유지 */
  }
`;

const SearchButton = styled.button`
  background-color: #ff9800;
  color: white;
  border: none;
  width: 15%;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f57c00;
  }
`;

const SubmitButton = styled.button`
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

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  width: 600px;
  height: 500px;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

function RegisterRestaurant() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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

  const handlePostcodeComplete = (data) => {
    setSido(data.sido);
    setSigungu(data.sigungu);
    setAddress(data.address);
    setIsPopupOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('restaurantRequestDto', new Blob([JSON.stringify({
      name,
      sido,
      sigungu,
      address,
      detailAddress,
      phoneNumber,
      category,
      capacity
    })], { type: 'application/json' }));
    if (imageUrl) {
      formData.append('image', imageUrl);
    }
    try {
      await fetchData('/restaurants', {
        method: 'POST',
        body: formData,
      });
      alert('식당 등록이 완료되었습니다!');
      navigate('/dashboard');
    } catch (error) {
      alert('식당 등록 실패');
    }
  };

  return (
      <div className="container">
        <Header>
          <h1 style={{ color: 'white' }}>GOOD BITE - 식당 등록</h1>
        </Header>
        <Container>
          <Form id="store-register-form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="store-name">식당 이름</Label>
              <Input
                  id="store-name"
                  name="name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-address">식당 주소</Label>
              <AddressWrapper>
                <AddressInput
                    id="store-address"
                    name="address"
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    readOnly
                />
                <SearchButton type="button" onClick={() => setIsPopupOpen(true)}>
                  주소 검색
                </SearchButton>
              </AddressWrapper>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="detail-address">상세 주소</Label>
              <Input
                  id="detail-address"
                  name="detailAddress"
                  required
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-phonenumber">식당 전화번호</Label>
              <Input
                  id="store-phonenumber"
                  name="phoneNumber"
                  required
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="store-category">카테고리</Label>
              <select
                  id="store-category"
                  name="category"
                  required
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
              <Label htmlFor="store-capacity">수용 인원</Label>
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
              <Label htmlFor="store-photo">식당 사진</Label>
              <Input
                  accept="image/*"
                  id="store-photo"
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
            <SubmitButton className="submit-btn" type="submit">식당 등록하기</SubmitButton>
          </Form>
        </Container>

        {/* DaumPostcode 팝업 */}
        {isPopupOpen && (
            <>
              <PopupOverlay onClick={() => setIsPopupOpen(false)} />
              <PopupContainer>
                <DaumPostcode onComplete={handlePostcodeComplete} />
              </PopupContainer>
            </>
        )}
      </div>
  );
}

export default RegisterRestaurant;