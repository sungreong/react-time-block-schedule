import React from "react";
import TimeBlockDisplay from "../TimeBlockDisplay";
import TimeBlocksClock from "../TimeBlocksPieChart";
import styles from "./TimeBlockOptions.module.css";
const TimeBlockOptions = ({ blocks,selectRef,uniqueDates,setSelectedDate,selectedDate, deleteBlock, updateBlock }) => (
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
      <div className={styles["time-block-display"]}>
        <TimeBlockDisplay blocks={blocks} selectedDate={selectedDate} deleteBlock={deleteBlock} updateBlock={updateBlock} />
      </div>
    </div>
  );

export default TimeBlockOptions;