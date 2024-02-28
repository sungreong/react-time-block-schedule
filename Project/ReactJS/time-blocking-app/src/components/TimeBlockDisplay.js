import React, { useState, useEffect } from 'react';
function TimeBlockDisplay({ blocks, selectedDate }) {
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
  

  return (
    <div>
      {filteredBlocks.length > 0 ? filteredBlocks.map((block, index) => (
        <div key={index} className="time-block-item" onClick={() => toggleBlockDetails(index)}>
          <p>{block.startTime} ~ {block.endTime}: {block.task}</p>
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
