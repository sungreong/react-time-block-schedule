import React from 'react';

function getDateTime(date, time) {
    return new Date(`${date}T${time}`);
  }

export const calculatePercentage = (date,startTime, endTime) => {
    const startDateTime = getDateTime(date, startTime);
    const endDateTime = getDateTime(date, endTime);
    const now = new Date();
    // 총 시간과 현재까지 경과한 시간 계산
    // 전체 시간과 경과 시간을 밀리초로 계산합니다.
    const totalTime = endDateTime - startDateTime;
    const elapsedTime = now - startDateTime;
    
    // 진행률을 계산합니다. (0 ~ 100 사이의 값)
    const percentage = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
    return percentage;
  }
