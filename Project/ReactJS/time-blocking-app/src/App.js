import React, { useEffect,useState, useRef } from 'react';
import TimeBlockForm from './components/TimeBlockForm';
import TimeBlockDisplay from './components/TimeBlockDisplay';
import TimeBlocksClock from './components/TimeBlocksPieChart';
import MyCalendar from './components/Calendar';
import DigitalClock from './components/DigitalClock';
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { downloadJson } from './utils/downloadJson';
import Modal from './components/Modal';
import Header from './components/Header';
import SelectOption from './components/SelectOption';
import NotificationArea from './components/NotificationArea';
import TimeBlockOptions from './components/TimeBlockOptions';
function App() {
  const [blocks, setBlocks] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tempRemovedBlocks, setTempRemovedBlocks] = useState([]);



  const tempRemoveBlock = (blockIndex) => {
    // 주석 달기
    // blocks 배열에서 blockIndex에 해당하는 요소를 제거하고, 제거된 요소를 tempRemovedBlocks 배열에 추가
    const removedBlock = blocks[blockIndex];
    const newBlocks = blocks.filter((_, index) => index !== blockIndex);
    setBlocks(newBlocks);
    setTempRemovedBlocks([...tempRemovedBlocks, removedBlock]);
  };

  const restoreBlock = (blockIndex) => {
    // 주석 달기
    // tempRemovedBlocks 배열에서 blockIndex에 해당하는 요소를 제거하고, 제거된 요소를 blocks 배열에 추가
    const restoredBlock = tempRemovedBlocks[blockIndex];
    const newTempRemovedBlocks = tempRemovedBlocks.filter((_, index) => index !== blockIndex);
    setBlocks([...blocks, restoredBlock]);
    setTempRemovedBlocks(newTempRemovedBlocks);
  };
  const handleDownload = () => {
    downloadJson(blocks, 'timeBlocks.json');
  };
  useEffect(() => {
    const dates = blocks.map(block => block.date.split('T')[0]); // 가정: block.date 형식이 "YYYY-MM-DDTHH:MM"임
    const uniqueDates = Array.from(new Set(dates)); // 유니크한 날짜만 추출
    setUniqueDates(uniqueDates);
  }, [blocks]);

  const handleFileChange = (uploadedData) => {
    // 파일 업로드로부터 받은 데이터로 blocks 상태 업데이트
    setBlocks(uploadedData);
  };
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
  useEffect(() => {
    const dates = blocks.map(block => block.date.split('T')[0]); // 가정: block.date 형식이 "YYYY-MM-DDTHH:MM"임
    const uniqueDates = Array.from(new Set(dates)); // 유니크한 날짜만 추출
    setUniqueDates(uniqueDates);
  }, [blocks]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ToastContainer />
      <Header />  
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: isCollapsed ? '0%' : (isMobile ? '65%' : '30%'), transition: 'width 0.3s', overflow: 'hidden' }}>
            {!isCollapsed && (
              <>
                <Modal toggleModal={toggleModal} addBlocks={addBlocks} updateBlocksDate={updateBlocksDate} handleFileChange={handleFileChange} handleDownload={handleDownload} />
              </>
            )}
          </div>
            {/* 오른쪽 패널 */}
          <ToggleArrow />
          <NotificationArea blocks={blocks} />
          <div style={{ width: isCollapsed ? '95%' : (isMobile ? '35%' : '70%'), transition: 'width 0.3s' }}>
            <div>
              <div>
                <SelectOption selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
              </div>
              {selectedOption === 'timeBlocks' && (
              <TimeBlockOptions 
                selectRef = {selectRef}
                uniqueDates = {uniqueDates}
                blocks={blocks} 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate}
                deleteBlock={deleteBlock} 
                updateBlock={updateBlock} />)}
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
