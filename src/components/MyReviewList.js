import React, {useEffect, useState} from 'react';
import '../styles/MyReviewList.css';
import {fetchData} from "../util/api";
import {useNavigate} from "react-router-dom";

const sampleReviews = [
  {
    restaurantName: "맛있는 짜장면",
    date: "2023-05-15",
    rating: 4.5,
    content: "짜장면이 정말 맛있었어요. 면이 쫄깃하고 소스도 진해서 좋았습니다."
  },
  {
    restaurantName: "신선한 초밥",
    date: "2023-05-10",
    rating: 5,
    content: "초밥의 밥과 생선 모두 신선했습니다. 특히 연어 초밥이 일품이었어요!"
  },
  {
    restaurantName: "화덕 피자",
    date: "2023-05-05",
    rating: 4,
    content: "화덕에서 구운 피자라 그런지 도우가 정말 맛있었어요. 토핑도 풍성해서 좋았습니다."
  }
];

function MyReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const response = await fetchData(`/reviews/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setReviews(response.data);
        } else {
          setError(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };
    fetchMyReviews();
  }, []);

  const navigateToUpdateReview = (reviewId) => {
    navigate(`/update-review/${reviewId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (reviews.length === 0) {
    return <li className="no-reviews">작성한 리뷰가 없습니다.</li>;
  }

  return (
      <>
        {reviews.map((review, index) => (
            <li className="review-item" key={index}>
              <div className="review-header">
                <span className="restaurant-name">{review.restaurantName}</span>
                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="review-rating">★ {review.rating.toFixed(1)}</div>
              <p className="review-content">{review.content}</p>
              <button
                  className="edit-button"
                  onClick={() => navigateToUpdateReview(review.reviewId)}
              >
                수정
              </button>
            </li>
        ))}
      </>
  );
}

function App() {
  return (
      <div className="App">
        <header className="header">
          <h1>GOOD BITE</h1>
          <nav>
            {/* 여기에 네비게이션 메뉴 항목을 추가할 수 있습니다 */}
          </nav>
        </header>
        <div className="container">
          <h2>내가 쓴 리뷰 목록</h2>
          <ul className="review-list">
            <MyReviewList />
          </ul>
        </div>
      </div>
  );
}

export default App;