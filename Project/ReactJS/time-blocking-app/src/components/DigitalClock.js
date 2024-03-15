import React, { useState, useEffect,useRef } from 'react';
import './DigitalClock.css'; // Ensure to import your CSS correctly

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]); // 값이 변경될 때마다 이전 값을 ref에 저장
  return ref.current; // 이전 값을 반환
}

function DigitalClock() {
  // 현재 시간 상태
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSeconds, setShowSeconds] = useState(false); // 초를 표시할지 여부를 결정하는 상태
  const [useFlip, setUseFlip] = useState(false); // flip 애니메이션을 사용할지 결정하는 상태

  // 이전 시간 상태
  const previousTime = usePrevious(currentTime);

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDigit = (digit) => digit.toString().padStart(2, '0');

  const hours = formatDigit(currentTime.getHours());
  const minutes = formatDigit(currentTime.getMinutes());
  const seconds = formatDigit(currentTime.getSeconds());

  const renderDigits = (timeString, previousTimeString, type) => (
    <div className="time-section">
      {timeString.split('').map((digit, index) => {
        // 이전 시간과 현재 시간을 비교하여 변화가 있는지 확인
        const isFlipped = useFlip && previousTimeString && digit !== previousTimeString[index];
        return (
          <span key={`${type}-${index}-${digit}`} className={isFlipped ? 'flip' : ''}>
            {digit}
          </span>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="clock-button-container">
        <button
          className={`toggle-button ${!showSeconds ? 'active' : ''}`}
          onClick={() => setShowSeconds(!showSeconds)}>
          {showSeconds ? 'Show HH:MM' : 'Show HH:MM:SS'}
        </button>
        <button 
          className={`toggle-button ${!useFlip ? 'active' : ''}`}
          onClick={() => setUseFlip(!useFlip)}>
          {useFlip ? 'Disable Flip' : 'Enable Flip'}
        </button>
      </div>
      <div className="clock-container">
        {renderDigits(hours, previousTime && formatDigit(previousTime.getHours()), 'hour')}
        :
        {renderDigits(minutes, previousTime && formatDigit(previousTime.getMinutes()), 'minute')}
        {showSeconds && ":"}
        {showSeconds && renderDigits(seconds, previousTime && formatDigit(previousTime.getSeconds()), 'second')}
      </div>
    </div>

  );
}


export default DigitalClock;
