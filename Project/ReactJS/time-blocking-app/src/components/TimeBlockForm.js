import React, { useState, useEffect } from 'react';

function current_date() {
  const today = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = today.toLocaleDateString('en-CA', { timeZone: timeZone });
  return localDate;

}

function TimeBlockForm({ onSubmit , onUpdateDate  }) {
  const [date, setDate] = useState(''); // 날짜 상태 추가
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [task, setTask] = useState('');

  
  useEffect(() => {
    // 오늘 날짜 설정
    const localDate = current_date()
    setDate(localDate); // 'YYYY-MM-DD' 형식의 날짜로 상태 업데이트
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit([{ date, startTime, endTime, task }]);
    setStartTime('');
    setEndTime('');
    setTask('');
  };

  const handleWorkdaySetting = () => {
    const confirmSave = window.confirm('직장인 셋팅을 저장하시겠습니까?');
    if (confirmSave) {
      // 출근 시간과 점심 시간 설정
      const presets = [
        { date:date, startTime: '09:00', endTime: '18:00', task: '출근' },
        { date:date, startTime: '11:30', endTime: '13:00', task: '점심 시간' },
      ];
      // 예를 들어 여기서는 첫 번째 프리셋만 사용
      onSubmit(presets);
      // 저장 후 알림
      alert('직장인 셋팅이 저장되었습니다.');
    }
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
  // 오늘 날짜로 일정 바꾸기 버튼 클릭 시
  const handleTodaySetting = () => {
    const today = current_date();
    onUpdateDate(today); // 오늘 날짜로 모든 블록 업데이트

  }
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
      <button type="button" onClick={handleWorkdaySetting} className="preset-btn">직장인 셋팅</button>
      <button 
      type="button" 
      className='preset-btn' 
      onClick={handleTodaySetting} 
      >오늘 날짜로 일정 바꾸기</button>
    </form>
  );
}

export default TimeBlockForm;
