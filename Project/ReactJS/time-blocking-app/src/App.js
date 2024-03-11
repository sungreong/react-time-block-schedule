import React, { useEffect,useState, useRef,useMemo } from 'react';
import TimeBlockForm from './components/TimeBlockForm';
import TimeBlockDisplay from './components/TimeBlockDisplay';
import TimeBlocksClock from './components/TimeBlocksPieChart';
import MyCalendar from './components/Calendar';
import DigitalClock from './components/DigitalClock';
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        // 헤더에서 공백과 줄바꿈 문자 제거
        const headers = rows[0].split(',').map(header => header.trim().replace(/\r/g, ''));

        // 필드 매핑 검증
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
      setBlocks(data);
    });
  };

  
  // const addBlock = (block) => {
  //   setBlocks([...blocks, block]);
  // };

  const addBlocks = (newBlocks) => {
    setBlocks(currentBlocks => [...currentBlocks, ...newBlocks]);
  };
  const updateBlocksDate = (newDate) => {
    setBlocks(currentBlocks =>
      currentBlocks.map(block => ({ ...block, date: newDate }))
    );
  };

  const [selectedDate, setSelectedDate] = useState(''); // 날짜 선택을 위한 상태
  const selectRef = useRef(null); // select 요소에 대한 참조 생성
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(''); // 컴포넌트 선택을 위한 상태
  

  useEffect(() => {
    const adjustSelectPosition = () => {
      if (selectRef.current) {
        const selectHeight = selectRef.current.offsetHeight;
        const parentHeight = selectRef.current.parentNode.offsetHeight;
        const topPosition = (parentHeight - selectHeight) / 2; // 중앙 위치 계산
        // const topPosition = (parentHeight - selectHeight) / 1.5; // 중앙 위치 계산
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
  }, [isMobile,isCollapsed,selectedOption]); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시 1회 실행



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const deleteBlock = (blockIndex) => {
    setBlocks(currentBlocks => currentBlocks.filter((_, index) => index !== blockIndex));
  };
  const updateBlock = (index, newBlockData) => {
    setBlocks(currentBlocks => {
      const updatedBlocks = [...currentBlocks];
      updatedBlocks[index] = newBlockData; // 인덱스에 해당하는 시간 블록 업데이트
      return updatedBlocks;
    });
  };
  const ModalDiv = () => {
    return (    
    <div className="modal">
          <div className="modal-content">
            <p><strong>타임 블로킹 목록 추가</strong></p>
            <TimeBlockForm 
            onSubmit={(blocks) => { addBlocks(blocks); toggleModal(); }} 
            onUpdateDate={updateBlocksDate} // 여기에 추가
            />
            <hr />
            <p><strong>파일로 불러오기(csv,json)</strong></p>
            <div style={{ marginBottom: "10px" }}>
            데이터 포맷:
            <ul>
              <li><code>date(YYYY-MM-DD)</code></li>
              <li><code>startTime(HH:MM)</code></li>
              <li><code>endTime(HH:MM)</code></li>
              <li><code>task(Any)</code></li>
            </ul>
            </div>
                  
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1vh', marginBottom: "1vh"}}>
              
              <input type="file" onChange={handleFileChange} accept="application/json" />
            </div>
            <p></p>
            <hr />
            <p><strong>타임 블록 저장하기</strong></p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1vh' , marginBottom: "1vh"}}>
              <button onClick={handleDownload}>Download Time Block</button>
            </div>
            <p></p>
            <hr /> 
            </div>
        </div>)
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    const arrow = document.querySelector('.arrow');
    arrow.classList.toggle('collapsed');
  };
  function ToggleArrow() {
      const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
    };
  
    return (
      <div className='toggle-container' onClick={toggleSidebar}>
        <div className={`arrow ${isCollapsed ? 'collapsed' : ''}`}></div>
      </div>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
      setIsMobile(window.innerWidth <= 800);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* 왼쪽 패널 */}
        <div style={{
          display: 'flex', // Flexbox 레이아웃 적용
          justifyContent: 'center', // 가로축 중앙 정렬
          alignItems: 'center', // 세로축 중앙 정렬
          padding: '20px', // 상하좌우 여백
          backgroundColor: '#f0f0f0', // 배경색
          color: '#333', // 글자색
          borderBottom: '2px solid #ccc', // 하단 테두리
        }}>
          <div style={{ 
            marginRight: '20px', // 시계와 제목 사이 간격
            fontSize: '24px', // 글자 크기
            fontWeight: 'bold', // 글자 굵기
          }}>
            시간 스케줄 관리 앱
          </div>
          <DigitalClock />
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: isCollapsed ? '0%' : (isMobile ? '55%' : '30%'), transition: 'width 0.3s', overflow: 'hidden' }}>
            {!isCollapsed && (
              <>
                <ModalDiv />  
              </>
            )}
          </div>
            {/* 오른쪽 패널 */}
          <ToggleArrow />
          <div style={{ width: isCollapsed ? '95%' : (isMobile ? '45%' : '70%'), transition: 'width 0.3s' }}>
            <div>
            <div className="centered-container">
              <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)} className="select-box">
                <option value="">선택...</option>
                <option value="timeBlocks">시간 블록 & 디스플레이</option>
                <option value="calendar">달력</option>
              </select>
              </div>
              {selectedOption === 'timeBlocks' && (
              <div className='time-blocks-container'>
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
                  <TimeBlockDisplay blocks={blocks} selectedDate={selectedDate} deleteBlock={deleteBlock} updateBlock={updateBlock}/>
                </div>
                </div>
              )}
              {selectedOption === 'calendar' && (
                <div>
                  <MyCalendar blocks={blocks} setBlocks={setBlocks} />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>  
  );
}

export default App;
