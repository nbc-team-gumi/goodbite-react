import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomerWaitingList.module.css';
import { fetchData } from '../util/api';

function CustomerWaitingList() {
  const [waitingList, setWaitingList] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentWaiting, setCurrentWaiting] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchColumn, setSearchColumn] = useState('restaurantName');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchWaitings(page, pageSize);
  }, [page, searchColumn, searchTerm, statusFilter, pageSize]);

  const fetchWaitings = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await fetchData(`/waitings?page=${page}&size=${pageSize}`, {
        method: 'GET',
      });

      const filteredWaitings = response.data.content.filter(waiting => {
        const value = waiting[searchColumn] || '';
        const matchesSearch = value.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? waiting.waitingStatus === statusFilter : true;
        return matchesSearch && matchesStatus;
      });

      const sortedWaitings = filteredWaitings.sort((a, b) =>
          new Date(b.createAt) - new Date(a.createAt)
      );

      setWaitingList(sortedWaitings);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching waitings:', error);
      setError('Failed to load waitings');
      setLoading(false);
    }
  };

  const openReviewModal = (waitingId, restaurantId) => {
    setCurrentWaiting({ waitingId, restaurantId });
    setReviewModalVisible(true);
  };

  const closeReviewModal = () => {
    setReviewModalVisible(false);
    setCurrentWaiting(null);
  };

  const openDetailsModal = (waiting) => {
    setCurrentWaiting(waiting);
    setDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
    setCurrentWaiting(null);
  };

  const openCancelModal = (waiting) => {
    setCurrentWaiting(waiting);
    setCancelModalVisible(true);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
    setCurrentWaiting(null);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const reviewText = e.target.reviewText.value;

    if (!rating || !reviewText) {
      alert('평점과 리뷰 내용을 모두 입력해 주세요.');
      return;
    }

    try {
      await fetchData('/waiting-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: currentWaiting.restaurantId,
          rating: Number(rating),
          content: reviewText,
        }),
      });

      closeReviewModal();
      alert('리뷰가 성공적으로 제출되었습니다!');
    } catch (error) {
      console.error('리뷰 제출 에러:', error);
      alert('리뷰 제출 중 오류가 발생했습니다.');
      closeReviewModal();
    }
  };

  const cancelWaiting = async () => {
    try {
      await fetchData(`/waitings/${currentWaiting.waitingId}`, {
        method: 'DELETE',
      });

      closeCancelModal();
      fetchWaitings(page, pageSize); // 목록 갱신
      alert('웨이팅이 성공적으로 취소되었습니다!');
    } catch (error) {
      console.error('웨이팅 취소 에러:', error);
      alert('웨이팅 취소 중 오류가 발생했습니다.');
      closeCancelModal();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(0);
  };

  return (
      <div>
        <div className={styles.banner}>
          GoodBite 내 웨이팅 리스트
        </div>
        <div className={styles.container}>
          <h1>내가 등록한 웨이팅</h1>

          <div className={styles.searchContainer}>
            <div className={styles.searchFilter}>
              <label htmlFor="statusFilter">대기 상태:</label>
              <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
                <option value="">전체</option>
                <option value="WAITING">대기 중</option>
                <option value="SEATED">착석</option>
                <option value="CANCELLED">취소됨</option>
              </select>

              <label htmlFor="searchColumn">검색 칼럼:</label>
              <select id="searchColumn" value={searchColumn} onChange={handleSearchColumnChange}>
                <option value="restaurantName">식당 이름</option>
                <option value="demand">요청 사항</option>
              </select>
              <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  placeholder="검색어를 입력하세요"
              />
              <button onClick={handleSearch}>검색</button>

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
          </div>

          {loading ? (
              <p>Loading...</p>
          ) : error ? (
              <p>{error}</p>
          ) : (
              <>
                <div className={styles.waitingListContainer}>
                  <table className={styles.waitingList} id="waitingList">
                    <thead>
                    <tr>
                      <th>식당 이름</th>
                      <th>요청 사항</th>
                      <th>등록 시간</th>
                      <th>삭제 시간</th>
                      <th>대기 상태</th>
                      <th>동작</th> {/* Added Actions column */}
                    </tr>
                    </thead>
                    <tbody>
                    {waitingList.map(waiting => (
                        <tr
                            key={waiting.waitingId}
                            className={styles.waitingRow}
                            onClick={() => openDetailsModal(waiting)}
                        >
                          <td>{waiting.restaurantName}</td>
                          <td>
                            {waiting.demand ? (
                                waiting.demand.length > 20
                                    ? `${waiting.demand.substring(0, 20)}...`
                                    : waiting.demand
                            ) : 'N/A'}
                          </td>
                          <td>{new Date(waiting.createAt).toLocaleString()}</td>
                          <td>{waiting.deletedAt ? new Date(waiting.deletedAt).toLocaleString() : 'N/A'}</td>
                          <td>
                        <span
                            className={`${styles.status} ${styles[`status-${waiting.waitingStatus.toLowerCase()}`]}`}
                        >
                          {waiting.waitingStatus === 'WAITING'
                              ? '대기 중'
                              : waiting.waitingStatus === 'SEATED'
                                  ? '착석'
                                  : '취소됨'}
                        </span>
                          </td>
                          <td>
                            {waiting.waitingStatus === 'WAITING' && (
                                <button
                                    className={styles.cancelBtn}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event propagation
                                      openCancelModal(waiting);
                                    }}
                                >
                                  취소
                                </button>
                            )}
                            {waiting.waitingStatus === 'SEATED' && (
                                <button
                                    className={styles.reviewBtn}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event propagation
                                      openReviewModal(waiting.waitingId, waiting.restaurantId);
                                    }}
                                >
                                  리뷰
                                </button>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                <h5>검색은 현재 페이지에서만 가능합니다.</h5>
                <h5>웨이팅은 등록 시간 기준으로 현재 페이지 내 최신 순으로 정렬됩니다.</h5>
                <div className={styles.pagination}>
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    이전
                  </button>
                  <span>
                페이지 {page + 1} / {totalPages}
              </span>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
                    다음
                  </button>
                </div>
              </>
          )}
        </div>

        {reviewModalVisible && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={closeReviewModal}>&times;</span>
                <h2>리뷰 작성</h2>
                <form className={styles.reviewForm} onSubmit={submitReview}>
                  <label>평점:</label>
                  <div>
                    <label>
                      <input type="radio" name="rating" value="1" required /> 1
                    </label>
                    <label>
                      <input type="radio" name="rating" value="2" required /> 2
                    </label>
                    <label>
                      <input type="radio" name="rating" value="3" required /> 3
                    </label>
                    <label>
                      <input type="radio" name="rating" value="4" required /> 4
                    </label>
                    <label>
                      <input type="radio" name="rating" value="5" required /> 5
                    </label>
                  </div>
                  <label>리뷰 내용:</label>
                  <textarea name="reviewText" required></textarea>
                  <button type="submit">제출</button>
                </form>
              </div>
            </div>
        )}

        {detailsModalVisible && currentWaiting && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={closeDetailsModal}>&times;</span>
                <h2>웨이팅 상세 정보</h2>
                <p><strong>식당 이름:</strong> {currentWaiting.restaurantName}</p>
                <p><strong>요청 사항:</strong> {currentWaiting.demand || 'N/A'}</p>
                <p><strong>등록 시간:</strong> {new Date(currentWaiting.createAt).toLocaleString()}</p>
                <p><strong>삭제 시간:</strong> {currentWaiting.deletedAt ? new Date(currentWaiting.deletedAt).toLocaleString() : 'N/A'}</p>
                <p><strong>대기 상태:</strong> {currentWaiting.waitingStatus === 'WAITING' ? '대기 중' : currentWaiting.waitingStatus === 'SEATED' ? '착석' : '취소됨'}</p>
              </div>
            </div>
        )}

        {cancelModalVisible && currentWaiting && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={closeCancelModal}>&times;</span>
                <h2>웨이팅 취소 확인</h2>
                <p>이 웨이팅을 취소하시겠습니까?</p>
                <button onClick={cancelWaiting}>확인</button>
                <button onClick={closeCancelModal}>취소</button>
              </div>
            </div>
        )}
      </div>
  );
}

export default CustomerWaitingList;
