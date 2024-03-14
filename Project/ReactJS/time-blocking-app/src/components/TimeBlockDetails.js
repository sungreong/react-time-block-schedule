import './TimeBlockDisplay.css'; // Ensure to import your CSS correctly
import {Countdown} from './countdown/countdown';
import React, { useState, useEffect } from 'react';

function DetailBlock({ index, block, updateBlock , ClickBlockDetail }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setEditData(block); // 컴포넌트가 마운트될 때 초기화
  }, [block]); // block이 변경될 때마다 editData를 업데이트


  const handleEditClick = (event) => {
    // event.stopPropagation()
    setIsEditing(true);
  };
  const handleSaveClick = (event) => {
    // event.stopPropagation()
    // 상위 컴포넌트의 updateBlock 함수를 호출하여 변경 사항 저장
    updateBlock(index, editData);
    setIsEditing(false); // 편집 모드 종료
  };

  const handleCancelClick = (event) => {
    // event.stopPropagation()
    setIsEditing(false); // 편집 모드 종료
  };

  return (
    <div className="block-details">
      <div className="details-content">
        {isEditing ? (
          <>
            <div className="detail-form">
              <label>날짜: <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} /></label>
              <label>시작 시간: <input type="time" value={editData.startTime} onChange={e => setEditData({ ...editData, startTime: e.target.value })} /></label>
              <label>종료 시간: <input type="time" value={editData.endTime} onChange={e => setEditData({ ...editData, endTime: e.target.value })} /></label>
              <label>할 일: <input type="text" value={editData.task} onChange={e => setEditData({ ...editData, task: e.target.value })} /></label>
              <label>시작 알림(분 전): <input type="number" value={editData.startAlertBefore} onChange={e => setEditData({ ...editData, startAlertBefore: e.target.value })} /></label>
              <label>종료 알림(분 전): <input type="number" value={editData.endAlertBefore} onChange={e => setEditData({ ...editData, endAlertBefore: e.target.value })} /></label>
              <div className="button-container">

                <button onClick={handleSaveClick}>저장</button>
                <button className="cancel" onClick={handleCancelClick}>취소</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Countdown startdate={block.date+"T"+block.startTime} enddate={block.date+"T"+block.endTime} />
            <div className="card">
              <div className="detail-section">
                <span className="detail-label">날짜</span>
                <span className="detail-value">{block.date}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">시작 시간</span>
                <span className="detail-value">{block.startTime}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">종료 시간</span>
                <span className="detail-value">{block.endTime}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">할 일</span>
                <span className="detail-value">{block.task}</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">시작 알림</span>
                <span className="detail-value">{block.startAlertBefore}분 전</span>
              </div>
              <div className="detail-section">
                <span className="detail-label">종료 알림</span>
                <span className="detail-value">{block.endAlertBefore}분 전</span>
              </div>
              <div className="button-container">
                <button className="button edit-btn" onClick={handleEditClick}>편집</button>
                <button className="button close-btn" onClick={(e) => {
                  e.stopPropagation(); // 이벤트 버블링 방지
                  ClickBlockDetail(null)}}>닫기</button>
              </div>
            </div>
            
          </>
        )}
      </div>
      
    </div>
  );
}
export { DetailBlock };