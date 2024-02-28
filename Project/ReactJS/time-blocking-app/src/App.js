import React, { useEffect,useState, useRef } from 'react';
import TimeBlockForm from './components/TimeBlockForm';
import TimeBlockDisplay from './components/TimeBlockDisplay';
import TimeBlocksClock from './components/TimeBlocksPieChart';
import './App.css';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);

  function downloadJson(data, filename) {
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const handleDownload = () => {
    downloadJson(blocks, 'timeBlocks.json');
  };
  useEffect(() => {
    const dates = blocks.map(block => block.date.split('T')[0]); // 가정: block.date 형식이 "YYYY-MM-DDTHH:MM"임
    const uniqueDates = Array.from(new Set(dates)); // 유니크한 날짜만 추출
    setUniqueDates(uniqueDates);
  }, [blocks]);
  function formatTime(time) {
    return time.split(':').map(part => part.length < 2 ? `0${part}` : part).join(':');
  }
  const uploadJsonOrCsv = (event, onLoadCallback) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      if (file.name.endsWith('.csv')) {
        // Windows 스타일 줄바꿈을 Unix 스타일로 변환
        const normalizedContent = content.replace(/\r\n/g, '\n');
        const rows = normalizedContent.split('\n');
        console.log(rows[1]);
        // 헤더에서 공백과 줄바꿈 문자 제거
        const headers = rows[0].split(',').map(header => header.trim().replace(/\r/g, ''));

        // 필드 매핑 검증
        console.log(headers);
        if (headers.length !== 4 || headers[0] !== 'date' || headers[1] !== 'startTime' || headers[2] !== 'endTime' || headers[3] !== 'task') {
          alert('CSV 파일의 형식이 올바르지 않습니다.');
          return;
        }

        const jsonData = rows.slice(1).reduce((acc, row) => {
          const values = row.split(',').map(value => value.trim());
          if (values.length > 3) {
            const formattedRow = {
              date: values[0],
              startTime: formatTime(values[1]), // 시간 포맷 변환 적용
              endTime: formatTime(values[2]), // 시간 포맷 변환 적용
              task: values.slice(3).join(','), // task가 컴마를 포함할 수 있으므로, 나머지 모든 요소를 조인
            };
            acc.push(formattedRow);
          }
          return acc;
        }, []);
        console.log(jsonData);
        onLoadCallback(jsonData);
      } else if (file.name.endsWith('.json')) {
        // JSON 파일 처리
        const data = JSON.parse(content);
        onLoadCallback(data);
      } else {
        alert('지원되지 않는 파일 형식입니다.');
      }
    };

    reader.readAsText(file);
  };
  const handleFileChange = (event) => {
    uploadJsonOrCsv(event, (data) => {
      console.log(data);
      setBlocks(data);
    });
  };

  
  const addBlock = (block) => {
    setBlocks([...blocks, block]);
  };
  const [selectedDate, setSelectedDate] = useState(''); // 날짜 선택을 위한 상태
  const selectRef = useRef(null); // select 요소에 대한 참조 생성

  useEffect(() => {
    const adjustSelectPosition = () => {
      if (selectRef.current) {
        const selectHeight = selectRef.current.offsetHeight;
        const parentHeight = selectRef.current.parentNode.offsetHeight;
        const topPosition = (parentHeight - selectHeight) / 2; // 중앙 위치 계산
        selectRef.current.style.top = `${topPosition}px`; // top 속성 조정
      }
    };

    // 컴포넌트 마운트 시와 윈도우 크기 변경 시 위치 조정
    adjustSelectPosition();
    window.addEventListener('resize', adjustSelectPosition);

    // cleanup 함수
    return () => {
      window.removeEventListener('resize', adjustSelectPosition);
    };
  }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 1회 실행
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <h1>타임 블로킹 앱</h1>
      <button onClick={toggleModal}>
        {isModalOpen ? '시간 블록 접기' : '시간 블록 추가'}
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* JSON 파일로부터 시간 블록 데이터 불러오기 */}
            <p>타임 블로킹 목록 추가</p>
            <TimeBlockForm onSubmit={(block) => { addBlock(block); toggleModal(); }} />
            <p>파일로 불러오기(csv,json)</p>
            <input type="file" onChange={handleFileChange} accept="application/json" />
          </div>
        </div>
      )}
      <p>타임 블로킹 목록 저장</p>
      <button onClick={handleDownload}>Download JSON</button>

      <div className="time-blocks-container">
        {/* <div className="time-blocks-date"> */}
          
        {/* </div> */}
        <div className="time-blocks-clock">
        <select ref={selectRef} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
            <option value="">날짜 선택...</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
        </select>
          <TimeBlocksClock blocks={blocks} selectedDate={selectedDate} />
        </div>
        <div className="time-block-display">
          <TimeBlockDisplay blocks={blocks} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}

export default App;
