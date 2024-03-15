import React from 'react';
import styles from './SelectOption.module.css';
const SelectOption = ({ selectedOption, setSelectedOption }) => (
  <div className={styles["centered-container"]}>
    <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)} className={styles["select-box"]}>
      <option value="">선택...</option>
      <option value="timeBlocks">시간 블록 & 디스플레이</option>
      <option value="calendar">달력</option>
    </select>
  </div>
);

export default SelectOption;
