import React, { useEffect,useState, useRef } from 'react';
import TimeBlockDisplay from "../TimeBlockDisplay";
import TimeBlocksClock from "../TimeBlocksPieChart";
import styles from "./TimeBlockOptions.module.css";
import TempRemovedBlocksDisplay from '../TempRemoveBlockDisplay';

const TimeBlockOptions = ({ 
  blocks,
  uniqueDates,
  setSelectedDate,
  selectedDate, 
  deleteBlock, 
  updateBlock,
  tempRemoveBlock,
  tempRemovedBlocks,
  restoreBlock,
  permanentlyRemoveBlock
}) => {
  const selectRef = useRef(null);

  useEffect(() => {
    const adjustSelectPosition = () => {
      if (selectRef.current) {
        const selectHeight = selectRef.current.offsetHeight;
        const parentHeight = selectRef.current.parentNode.offsetHeight;
        const topPosition = (parentHeight - selectHeight) / 2;
        selectRef.current.style.top = `${topPosition}px`;
      }
    };

    adjustSelectPosition();
    window.addEventListener('resize', adjustSelectPosition);

    return () => {
      window.removeEventListener('resize', adjustSelectPosition);
    };
  }, []);
  return (
    <div className={styles['time-blocks-container']}>
      <div className={styles["time-blocks-clock"]}>
        <select ref={selectRef} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
                    <option value="">날짜 선택...</option>
                    {uniqueDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
        </select>
        <TimeBlocksClock blocks={blocks} selectedDate={selectedDate} />
      </div>
      <div className={styles["time-block-display-container"]}>
        <div className={styles["time-block-display"]}>
          <TimeBlockDisplay 
          blocks={blocks} 
          selectedDate={selectedDate} 
          deleteBlock={deleteBlock} 
          updateBlock={updateBlock} 
          tempRemoveBlock={tempRemoveBlock}
          />
        </div>
        <div className={styles["time-block-display"]}>
          <TempRemovedBlocksDisplay 
          tempRemovedBlocks={tempRemovedBlocks} 
          restoreBlock={restoreBlock} 
          permanentlyRemoveBlock={permanentlyRemoveBlock}
          />
        </div>
      </div>
    </div>
  );

}
export default TimeBlockOptions;