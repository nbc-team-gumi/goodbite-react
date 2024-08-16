import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomerReservationList.module.css';
import { fetchData } from '../util/api';

function CustomerReservationList() {
  const [reservationList, setReservationList] = useState([]);
  const [filteredReservationList, setFilteredReservationList] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchColumn, setSearchColumn] = useState('restaurantName');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterAndSortReservations();
  }, [reservationList, searchColumn, searchTerm, statusFilter]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetchData('/reservations/my', { method: 'GET' });
      setReservationList(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Failed to load reservations');
      setLoading(false);
    }
  };

  const filterAndSortReservations = () => {
    const validSearchColumns = ['restaurantName', 'requirement'];
    const column = validSearchColumns.includes(searchColumn) ? searchColumn : 'restaurantName';

    const filteredReservations = reservationList.filter(reservation => {
      const value = reservation[column] || '';
      const matchesSearch = typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? reservation.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });

    const sortedReservations = filteredReservations.sort((a, b) =>
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
    );

    setFilteredReservationList(sortedReservations);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const openDetailsModal = (reservation) => {
    setCurrentReservation(reservation);
    setDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
    setCurrentReservation(null);
  };

  const openCancelModal = (reservation) => {
    setCurrentReservation(reservation);
    setCancelModalVisible(true);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
    setCurrentReservation(null);
  };

  const openReviewModal = (reservation) => {
    setCurrentReservation(reservation);
    setReviewModalVisible(true);
  };

  const closeReviewModal = () => {
    setReviewModalVisible(false);
    setReviewText('');
    setRating(0);
    setReviewError(null);
    setReviewSuccess(null);
  };

  const cancelReservation = async () => {
    try {
      await fetchData(`/reservations/${currentReservation.reservationId}`, {
        method: 'DELETE',
      });

      closeCancelModal();
      fetchReservations(); // 목록 갱신
      alert('예약이 성공적으로 취소되었습니다!');
    } catch (error) {
      console.error('예약 취소 에러:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
      closeCancelModal();
    }
  };

  const submitReview = async () => {
    if (!reviewText || rating <= 0) {
      setReviewError('리뷰와 평점을 입력해주세요.');
      return;
    }

    try {
      const response = await fetchData(`/reservation-reviews`, {
        method: 'POST',
        body: JSON.stringify({
          reservationId: currentReservation.reservationId, // 예약 ID
          restaurantId: currentReservation.restaurantId,  // 식당 ID 추가
          content: reviewText, // 리뷰 내용
          rating,
        }),
      });

      setReviewSuccess('리뷰가 성공적으로 제출되었습니다!');
      setTimeout(() => closeReviewModal(), 2000); // 2초 후에 모달 닫기
      fetchReservations(); // 리뷰 제출 후 목록 갱신

    } catch (error) {
      console.error('리뷰 제출 오류:', error);
      setReviewError('리뷰 제출 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (newPage) => {
    const maxPage = Math.ceil(filteredReservationList.length / pageSize) - 1;
    if (newPage >= 0 && newPage <= maxPage) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page when page size changes
  };

  const currentReservations = filteredReservationList.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
      <div>
        <div className={styles.banner}>
          GoodBite 내 예약 리스트
        </div>
        <div className={styles.container}>
          <h1>내가 등록한 예약</h1>

          <div className={styles.searchContainer}>
            <div className={styles.searchFilter}>
              <label htmlFor="statusFilter">예약 상태:</label>
              <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
                <option value="">전체</option>
                <option value="PENDING">대기 중</option>
                <option value="CONFIRMED">확정됨</option>
                <option value="CANCELLED">취소됨</option>
                <option value="COMPLETED">완료됨</option>
                <option value="REJECTED">거부됨</option>
              </select>

              <label htmlFor="searchColumn">검색 칼럼:</label>
              <select id="searchColumn" value={searchColumn} onChange={handleSearchColumnChange}>
                <option value="restaurantName">식당 이름</option>
                <option value="requirement">요청 사항</option>
              </select>
              <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  placeholder="검색어를 입력하세요"
              />
            </div>
            <div className={styles.pageSize}>
              <label htmlFor="pageSize">페이지 사이즈:</label>
              <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          {loading ? (
              <p>Loading...</p>
          ) : error ? (
              <p>{error}</p>
          ) : (
              <>
                <div className={styles.reservationListContainer}>
                  <table className={styles.reservationList} id="reservationList">
                    <thead>
                    <tr>
                      <th>식당 이름</th>
                      <th>요청 사항</th>
                      <th>예약 시간</th>
                      <th>상태</th>
                      <th>동작</th> {/* 추가된 열 */}
                    </tr>
                    </thead>
                    <tbody>
                    {currentReservations.map(reservation => (
                        <tr
                            key={reservation.reservationId}
                            className={styles.reservationRow}
                            onClick={() => openDetailsModal(reservation)}
                        >
                          <td>{reservation.restaurantName || 'N/A'}</td>
                          <td>
                            {reservation.requirement ? (
                                reservation.requirement.length > 20
                                    ? `${reservation.requirement.substring(0, 20)}...`
                                    : reservation.requirement
                            ) : 'N/A'}
                          </td>
                          <td>{new Date(`${reservation.date}T${reservation.time}`).toLocaleString()}</td>
                          <td>
                        <span
                            className={`${styles.status} ${styles[`status-${reservation.status.toLowerCase()}`]}`}
                        >
                          {reservation.status === 'PENDING'
                              ? '대기 중'
                              : reservation.status === 'CONFIRMED'
                                  ? '확정됨'
                                  : reservation.status === 'CANCELLED'
                                      ? '취소됨'
                                      : reservation.status === 'COMPLETED'
                                          ? '완료됨'
                                          : reservation.status === 'REJECTED'
                                              ? '거부됨'
                                              : 'N/A'}
                        </span>
                          </td>
                          <td>
                            {reservation.status === 'COMPLETED' && (
                                <button onClick={(e) => {
                                  e.stopPropagation();
                                  openReviewModal(reservation);
                                }}>
                                  리뷰 작성
                                </button>
                            )}
                            {reservation.status === 'PENDING' && (
                                <button onClick={(e) => {
                                  e.stopPropagation();
                                  openCancelModal(reservation);
                                }}>
                                  취소
                                </button>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.pagination}>
                  <button
                      className={styles.prevButton}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                  >
                    이전
                  </button>
                  <button
                      className={styles.nextButton}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(filteredReservationList.length / pageSize) - 1}
                  >
                    다음
                  </button>
                </div>
              </>
          )}
        </div>

        {/* 세부 사항 모달 */}
        {detailsModalVisible && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>예약 세부사항</h2>
                <p>식당 이름: {currentReservation.restaurantName}</p>
                <p>예약 시간: {new Date(`${currentReservation.date}T${currentReservation.time}`).toLocaleString()}</p>
                <p>요청 사항: {currentReservation.requirement || 'N/A'}</p>
                <p>상태: {currentReservation.status}</p>
                <button onClick={closeDetailsModal}>닫기</button>
              </div>
            </div>
        )}

        {/* 예약 취소 모달 */}
        {cancelModalVisible && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>예약 취소</h2>
                <p>예약을 취소하시겠습니까?</p>
                <button onClick={cancelReservation}>확인</button>
                <button onClick={closeCancelModal}>취소</button>
              </div>
            </div>
        )}

        {/* 리뷰 작성 모달 */}
        {reviewModalVisible && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>리뷰 작성</h2>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="리뷰를 작성하세요"
                />
                <div>
                  <label>평점:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={0}>선택하세요</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
                {reviewError && <p className={styles.error}>{reviewError}</p>}
                {reviewSuccess && <p className={styles.success}>{reviewSuccess}</p>}
                <button onClick={submitReview}>리뷰 제출</button>
                <button onClick={closeReviewModal}>취소</button>
              </div>
            </div>
        )}
      </div>
  );
}

export default CustomerReservationList;
