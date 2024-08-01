import React, { useState } from 'react';
import '../styles/Modal.css';

const DashboardModal = ({ show, onClose, onSubmit, waitingId, currentPartySize, currentDemand }) => {
  const [partySize, setPartySize] = useState(currentPartySize || 0);
  const [demand, setDemand] = useState(currentDemand || '');

  const handlePartySizeChange = (e) => {
    setPartySize(e.target.value);
  };

  const handleDemandChange = (e) => {
    if (e.target.value.length <= 30) {
      setDemand(e.target.value);
    }
  };

  const handleSubmit = () => {
    onSubmit(waitingId, partySize, demand);
  };

  if (!show) {
    return null;
  }

  return (
      <div className="modal">
        <div className="modal-content">
          <h2>수정</h2>
          <label>
            인원 수
            <input
                type="number"
                value={partySize}
                onChange={handlePartySizeChange}
                min="0"
            />
          </label>
          <br />
          <label>
            요구사항
            <input
                type="text"
                value={demand}
                onChange={handleDemandChange}
            />
          </label>
          <div className="modal-actions">
            <button onClick={handleSubmit}>확인</button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
  );
};

export default DashboardModal;
