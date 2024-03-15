

import React, { useState, useEffect } from 'react';
import './TimeBlockDisplay.css'; // Ensure to import your CSS correctly
import { DetailBlock } from './TimeBlockDetails';
import {calculatePercentage} from '../utils/calculatePercentage';

function TimeBlockDisplay({ 
  blocks, 
  selectedDate, 
  deleteBlock, 
  updateBlock,
  tempRemoveBlock,
  }) {
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
  const borderColors = [
    '#9e9e9e', // 0% - 회색
    '#81c784', // 1% 이상 - 초록색의 시작 (5%에 해당하는 색상)
    '#81c784', // 5%
    '#74c476', // 10%
    '#67c168', // 15%
    '#5abd5a', // 20%
    '#4db84d', // 25%
    '#40b340', // 30%
    '#33ad33', // 35%
    '#26a826', // 40%
    '#1aa319', // 45%
    '#0d9e0d', // 50%
    '#2d940d', // 55%
    '#4d8a0e', // 60%
    '#6d800e', // 65%
    '#8d760f', // 70%
    '#ad6c0f', // 75%
    '#cd6210', // 80%
    '#ed5810', // 85%
    '#f04e11', // 90%
    '#f24411', // 95%
    '#f43a12', // 100% - 빨간색
  ];
  
  return (
    <div>
      {filteredBlocks.length > 0 ? filteredBlocks.map((block, index) => {
        const percentage = calculatePercentage(block.date, block.startTime, block.endTime);
        const colorIndex = percentage === 0 ? 0 : Math.min(Math.max(Math.ceil(percentage / 5), 1), borderColors.length - 1);
        const borderColor = borderColors[colorIndex];
        return (
          <div key={index} className="time-block-item" 
            onClick={() => ClickBlockDetail(index)}
            style={{
              border: `3px solid ${borderColor}`, // 동적으로 색상 적용
              margin: '10px 0',
              padding: '10px',
              borderRadius: '5px',
            }} >
            <button className="delete-btn" onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              deleteBlock(index);
            }}>X</button>
            <p style={{ margin: '5px' }}>{block.startTime} ~ {block.endTime}: {block.task}</p>
            <ProgressBar date={block.date} startTime={block.startTime} endTime={block.endTime} />
            {selectedBlockId === index && (
              <DetailBlock 
                key={index}
                index={index} 
                block={block} 
                deleteBlock={deleteBlock}
                updateBlock={updateBlock} 
                ClickBlockDetail={ClickBlockDetail}
                tempRemoveBlock={tempRemoveBlock}
              />
            )}
          </div>
        );
      }) : <p>선택한 날짜에 해당하는 시간 블록이 없습니다.</p>}
    </div>
  );
}

export default TimeBlockDisplay;
