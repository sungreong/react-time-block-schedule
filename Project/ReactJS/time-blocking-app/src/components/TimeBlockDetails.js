function TimeBlockDetails({date, startTime, endTime, task, onClose }) {
    return (
      <div className="details-popup">
        <button onClick={onClose}>닫기</button>
        <h3>상세 정보</h3>
        <p>날짜: {date}</p>
        <p>시작 시간: {startTime}</p>
        <p>종료 시간: {endTime}</p>
        <p>내용: {task}</p>
      </div>
    );
  }
  
export default TimeBlockDetails;
