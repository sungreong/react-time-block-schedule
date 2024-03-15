// components/TempRemovedBlocksDisplay.js
import React, { useState } from 'react';
import styles from './TempRemovedBlocksDisplay.module.css';
const TempRemovedBlocksDisplay = ({ 
  tempRemovedBlocks, 
  restoreBlock,
  permanentlyRemoveBlock

}) => {
  const [isVisible, setIsVisible] = useState(false); // 팝업 표시 상태

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {/* 휴지통 아이콘 클릭 시 toggleVisibility 함수 호출 */}
      <button onClick={toggleVisibility} className={styles["trash-icon"]}>
        🗑 임시 삭제된 항목 보기
      </button>
      
      {/* isVisible 상태에 따라 팝업 표시 */}
      {isVisible && (
        <div className={styles["temp-removed-popup"]}>
          <h3>임시 삭제된 항목:</h3>
          <ul>
            {tempRemovedBlocks.map((block, index) => (
              <li key={index}>
                {block.date} {block.task} ({block.startTime}~{block.endTime}) 
                <button 
                onClick={() => restoreBlock(index)}       
                className={styles["restore-btn"]}>복원</button> 
                <button 
                onClick={() => permanentlyRemoveBlock(index)}
                className={styles["delete-btn"]}>완전 삭제</button>
              </li>
            ))}
          </ul>
          {/* 팝업 닫기 버튼 */}
          <button onClick={toggleVisibility} className={styles["close-popup"]}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default TempRemovedBlocksDisplay;