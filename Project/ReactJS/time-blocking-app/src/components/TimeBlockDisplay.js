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
            <label>날짜: <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} /></label>
            <label>시작 시간: <input type="time" value={editData.startTime} onChange={e => setEditData({ ...editData, startTime: e.target.value })} /></label>
            <label>종료 시간: <input type="time" value={editData.endTime} onChange={e => setEditData({ ...editData, endTime: e.target.value })} /></label>
            <label>할 일: <input type="text" value={editData.task} onChange={e => setEditData({ ...editData, task: e.target.value })} /></label>
            <button onClick={handleSaveClick}>저장</button>
            <button onClick={handleCancelClick}>취소</button>
          </>
        ) : (
          <>
            <p className="detail"><span className="label">날짜:</span> {block.date}</p>
            <p className="detail"><span className="label">시작 시간:</span> {block.startTime}</p>
            <p className="detail"><span className="label">종료 시간:</span> {block.endTime}</p>
            <p className="detail"><span className="label">할 일:</span> {block.task}</p>
            <button onClick={handleEditClick}>편집</button>
            <button className="close-btn" onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              ClickBlockDetail(null)}}>상세 정보 닫기</button>
          </>
        )}
      </div>
    </div>
  );
}



function TimeBlockDisplay({ blocks, selectedDate, deleteBlock,updateBlock  }) {
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // 선택된 날짜에 해당하는 blocks만 필터링
  const filteredBlocks = blocks
  .filter(block => block.date === selectedDate)
  .sort((a, b) => a.startTime.localeCompare(b.startTime)); // startTime 기준 오름차순 정렬

  const toggleBlockDetails = (blockId) => {
    setSelectedBlockId((prevBlockId) => {
      // 클릭한 블록이 이미 선택된 블록이면 선택 해제, 아니면 해당 블록 선택
      return prevBlockId === blockId ? null : blockId;
    });
  };

  
  // TODO: 에러 발생
  // 버튼을 클릭해도 닫히지 않는 이슈!
  const ClickBlockDetail = (blockId) => {
    // 이벤트 버블링 방지 로직은 이 함수에서는 필요하지 않음
    setSelectedBlockId(blockId);
  }

  useEffect(() => {
    // 키보드 이벤트 핸들러
    const handleKeyDown = (event) => {
      // 엔터 키가 눌렸고, 어떤 블록의 상세 정보가 현재 표시되고 있는 경우
      if (event.key === 'Enter' && selectedBlockId !== null) {
        toggleBlockDetails(selectedBlockId); // 현재 표시된 상세 정보를 토글
      }
    };
  
    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
  
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBlockId]); // selectedBlockId가 변경될 때마다 이벤트 리스너를 업데이트

  function getDateTime(date, time) {
    return new Date(`${date}T${time}`);
  }
  function calculatePercentage(date,startTime, endTime) {
    const startDateTime = getDateTime(date, startTime);
    const endDateTime = getDateTime(date, endTime);
    const now = new Date();
    // 총 시간과 현재까지 경과한 시간 계산
    // 전체 시간과 경과 시간을 밀리초로 계산합니다.
    const totalTime = endDateTime - startDateTime;
    const elapsedTime = now - startDateTime;
    
    // 진행률을 계산합니다. (0 ~ 100 사이의 값)
    const percentage = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
    return percentage;
  }
  function ProgressBar({date, startTime, endTime }) {
    const [percentage, setPercentage] = useState(() => calculatePercentage(date, startTime, endTime));
  
    useEffect(() => {
      // 진행률을 1분마다 업데이트합니다.
      const intervalId = setInterval(() => {
        setPercentage(calculatePercentage(date,startTime, endTime));
      }, 60000); // 60000ms = 1분
  
      // 컴포넌트가 언마운트될 때 인터벌을 정리합니다.
      return () => clearInterval(intervalId);
    }, [date,startTime, endTime]);
    return (
      <div style={{ height: '3px', width: '100%', backgroundColor: '#ddd', borderRadius: '5px' }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          borderRadius: '5px',
          backgroundColor: percentage >= 100 ? '#d32f2f' : '#4caf50',
        }}></div>
      </div>
    );
  }
  
  console.log(selectedBlockId)
  return (
    <div>
      {filteredBlocks.length > 0 ? filteredBlocks.map((block, index) => (
        <div key={index} className="time-block-item" onClick={() => ClickBlockDetail(index)} >
          {/*  */}
          <button className="delete-btn" onClick={(e) => {
            e.stopPropagation(); // 이벤트 버블링 방지
            deleteBlock(index); // 현재 블록 삭제
          }}>X</button>
          <p style={{margin : '5px'}}>{block.startTime} ~ {block.endTime}: {block.task}</p>
          <ProgressBar date={block.date} startTime={block.startTime} endTime={block.endTime} />
          {/* 선택된 블록의 상세 정보 표시 */}
          {selectedBlockId === index && (
            <DetailBlock 
            key={index} 
            index={index} 
            block={block} 
            updateBlock={updateBlock} 
            ClickBlockDetail={ClickBlockDetail}
          />
          )}
        </div>
      )) : <p>선택한 날짜에 해당하는 시간 블록이 없습니다.</p>}
    </div>
  );
}

export default TimeBlockDisplay;
