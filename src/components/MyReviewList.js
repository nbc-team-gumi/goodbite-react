import React, { useEffect, useState } from 'react';
import '../styles/MyReviewList.css';
import { fetchData } from "../util/api";
import { useNavigate } from "react-router-dom";

function MyReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyReviews = async (page) => {
      try {
        const response = await fetchData(`/reviews/my?page=${page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.statusCode === 200) {
          setReviews(response.data.content);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.number);
        } else {
          setError(`Unexpected response data: ${response.message}`);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews(currentPage);
  }, [currentPage]);

  const navigateToUpdateReview = (reviewId) => {
    navigate(`/update-review/${reviewId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

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
        <ul className="review-list">
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
        </ul>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 0}>
            이전
          </button>
          <span>페이지 {currentPage + 1} / {totalPages === 0 ? totalPages + 1 : totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
            다음
          </button>
        </div>
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
          <MyReviewList />
        </div>
      </div>
  );
}

export default App;