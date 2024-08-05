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


function UpdateReview() {
  const { reviewId } = useParams();
  const [rating, setRating] = useState(1);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetchData(`/reviews/5`, {
          method: 'GET',
        });
        setRating(response.data.rating);
        setContent(response.data.content);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    // console.log(formData);
    try {
      await fetchData(`/reviews/5`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          content
        }),
      });
      alert('리뷰 수정이 완료되었습니다!');
      navigate('/restaurants');
    } catch (error) {
      alert('리뷰 수정 실패');
      navigate('/restaurants');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await fetchData(`/reviews/5`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('리뷰가 삭제되었습니다.');
        navigate('/restaurants');
      } catch (error) {
        alert('리뷰 삭제 실패');
        navigate('/restaurants');
      }
    }
  };

  return (
      <div className="container">
        <Header>
          <h1 style={{color: 'white'}}>GOOD BITE - 리뷰 수정</h1>
        </Header>
        <Container>
          <Form id="store-register-form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="review-rating">리뷰 평점</Label>
              <Input
                  id="review-rating"
                  name="reviewRating"
                  required
                  type="textarea"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="review-content">리뷰 내용</Label>
              <Input
                  id="review-content"
                  name="reivewContent"
                  required
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
              />
            </FormGroup>
            <SubmitBtn className="submit-btn" type="submit">리뷰 수정하기</SubmitBtn>
            <Btn className="btn-danger" type="button" onClick={handleDelete}>리뷰 삭제하기</Btn>
          </Form>
        </Container>
      </div>
  );
}

export default UpdateReview;