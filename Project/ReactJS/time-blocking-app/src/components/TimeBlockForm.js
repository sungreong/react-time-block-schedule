import React, { useState } from 'react';

function TimeBlockForm({ onSubmit }) {
  const [date, setDate] = useState(''); // 날짜 상태 추가
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, startTime, endTime, task });
    setStartTime('');
    setEndTime('');
    setTask('');
  };
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (!endTime) { // 종료 시간이 설정되지 않았으면, 시작 시간으로 설정
      setEndTime(newStartTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if (!startTime) { // 시작 시간이 설정되지 않았으면, 종료 시간으로 설정
      setStartTime(newEndTime);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="time-block-form">
      <div className="form-group">
        <label htmlFor="date">기간:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="startTime">시작 시간:</label>
        <input
          type="time"
          id="startTime"
          value={startTime}
          onChange={handleStartTimeChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="endTime">종료 시간:</label>
        <input
          type="time"
          id="endTime"
          value={endTime}
          onChange={handleEndTimeChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="task">할 일:</label>
        <input
          type="text"
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="할 일을 입력하세요"
          required
        />
      </div>
      <button type="submit" className="submit-btn">추가하기</button>
    </form>
  );
}

export default TimeBlockForm;
