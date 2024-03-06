import React, { useState, useEffect } from 'react';
import './DigitalClock.css'; // CSS 파일 임포트
function DigitalClock() {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const newHour = String(now.getHours()).padStart(2, '0');
      const newMinute = String(now.getMinutes()).padStart(2, '0');

      if (newHour !== hour) setHour(newHour);
      if (newMinute !== minute) setMinute(newMinute);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, [hour, minute]);

  return (
    <div className="clock-container">
      <div className="number-slide">{hour[0]}</div>
      <div className="number-slide">{hour[1]}</div>
      <span>:</span>
      <div className="number-slide">{minute[0]}</div>
      <div className="number-slide">{minute[1]}</div>
    </div>
  );
}

export default DigitalClock;