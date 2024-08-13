import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomerReservationList.module.css';
import { fetchData } from '../util/api';

function CustomerReservationList() {
  const [reservationList, setReservationList] = useState([]);
  const [filteredReservationList, setFilteredReservationList] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchColumn, setSearchColumn] = useState('restaurantName');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

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
                <option value="CONFIRMED">확정됨</option>
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
                          {reservation.status === 'CONFIRMED'
                              ? '확정됨'
                              : '거부됨'}
                        </span>
                          </td>
                          <td>
                            {reservation.status === 'CONFIRMED' && (
                                <div className={styles.actionBtns}>
                                  <button
                                      className={styles.cancelBtn}
                                      onClick={(e) => {
                                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                                        openCancelModal(reservation);
                                      }}
                                  >
                                    취소
                                  </button>
                                  <button
                                      className={styles.reviewBtn}
                                      onClick={(e) => {
                                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                                        // 리뷰 작성 모달 열기 함수 호출
                                      }}
                                  >
                                    리뷰
                                  </button>
                                </div>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                <h5>검색은 현재 페이지에서만 가능합니다.</h5>
                <h5>예약은 시간 기준으로 현재 페이지 내 최신 순으로 정렬됩니다.</h5>
                <div className={styles.pagination}>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    이전
                  </button>
                  <span>
                페이지 {currentPage + 1} / {Math.ceil(filteredReservationList.length / pageSize)}
              </span>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredReservationList.length / pageSize) - 1}>
                    다음
                  </button>
                </div>
              </>
          )}
        </div>

        {detailsModalVisible && currentReservation && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={closeDetailsModal}>&times;</span>
                <h2>예약 상세 정보</h2>
                <p>식당 이름: {currentReservation.restaurantName}</p>
                <p>예약 시간: {new Date(`${currentReservation.date}T${currentReservation.time}`).toLocaleString()}</p>
                <p>요청 사항: {currentReservation.requirement || 'N/A'}</p>
                <p>상태: {currentReservation.status === 'CONFIRMED' ? '확정됨' : '거부됨'}</p>
              </div>
            </div>
        )}

        {cancelModalVisible && currentReservation && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={closeCancelModal}>&times;</span>
                <h2>예약 취소</h2>
                <p>식당 이름: {currentReservation.restaurantName}</p>
                <p>예약 시간: {new Date(`${currentReservation.date}T${currentReservation.time}`).toLocaleString()}</p>
                <p>요청 사항: {currentReservation.requirement || 'N/A'}</p>
                <p>정말로 이 예약을 취소하시겠습니까?</p>
                <button onClick={cancelReservation}>확인</button>
                <button onClick={closeCancelModal}>취소</button>
              </div>
            </div>
        )}
      </div>
  );
}

export default CustomerReservationList;
