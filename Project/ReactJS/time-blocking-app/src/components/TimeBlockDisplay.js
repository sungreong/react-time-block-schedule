import React, { useState, useEffect } from 'react';
function TimeBlockDisplay({ blocks, selectedDate, deleteBlock  }) {
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // 선택된 날짜에 해당하는 blocks만 필터링
  const filteredBlocks = blocks
  .filter(block => block.date === selectedDate)
  .sort((a, b) => a.startTime.localeCompare(b.startTime)); // startTime 기준 오름차순 정렬

  const toggleBlockDetails = (blockId) => {
    if (selectedBlockId === blockId) {
      // 이미 선택된 블록을 다시 클릭한 경우, 선택 해제
      setSelectedBlockId(null);
    } else {
      // 다른 블록을 선택한 경우, 해당 블록의 ID로 설정
      setSelectedBlockId(blockId);
    }
  };

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
  return (
    <div>
      {filteredBlocks.length > 0 ? filteredBlocks.map((block, index) => (
        <div key={index} className="time-block-item" onClick={() => toggleBlockDetails(index)}>
          <button className="delete-btn" onClick={(e) => {
            e.stopPropagation(); // 이벤트 버블링 방지
            deleteBlock(index); // 현재 블록 삭제
          }}>X</button>
          <p style={{margin : '5px'}}>{block.startTime} ~ {block.endTime}: {block.task}</p>
          <ProgressBar date={block.date} startTime={block.startTime} endTime={block.endTime} />
          {/* 선택된 블록의 상세 정보 표시 */}
          {selectedBlockId === index && (
            <div className="block-details">
              <div className="details-content">
                <p className="detail"><span className="label">날짜:</span> {block.date}</p>
                <p className="detail"><span className="label">시작 시간:</span> {block.startTime}</p>
                <p className="detail"><span className="label">종료 시간:</span> {block.endTime}</p>
                <p className="detail"><span className="label">할 일:</span> {block.task}</p>
                <button className="close-btn" onClick={() => toggleBlockDetails(index)}>상세 정보 닫기</button>
              </div>
          </div>
          )}
        </div>
      )) : <p>선택한 날짜에 해당하는 시간 블록이 없습니다.</p>}
    </div>
  );
}

export default TimeBlockDisplay;
