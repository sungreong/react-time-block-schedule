import React from 'react';
import DigitalClock from '../DigitalClock';
import FlipClock from '../FlipClock/FlipClock';
const Header = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderBottom: '2px solid #ccc',
  }}>
    <div style={{ marginRight: '20px', fontSize: '24px', fontWeight: 'bold' }}>
      시간 스케줄 관리 앱
    </div>
    <FlipClock />
  </div>
);

export default Header;
