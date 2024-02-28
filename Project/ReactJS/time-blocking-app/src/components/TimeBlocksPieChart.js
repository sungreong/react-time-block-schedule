import React, { useState , useEffect} from 'react';

function TimeBlocksClock({ blocks, selectedDate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blockColors, setBlockColors] = useState({});

  
  function updateTime() {
    // 'Asia/Seoul'을 예로 들지만, 필요에 따라 다른 타임존으로 변경 가능
    const localDate = new Date();
    // const offset = date.getTimezoneOffset(); // 브라우저의 타임존과 UTC와의 차이(분)
    // const localDate = new Date(date.getTime() - (offset * 60 * 1000)); // 로컬 타임존으로 조정    setCurrentTime(currentTimeAsia);
    console.log("updateTime",localDate);
    setCurrentTime(localDate);
  }

  useEffect(() => {
    const newBlockColors = {};
    blocks.forEach((block, index) => {
      // 각 블록에 대해 고유한 키를 생성 (예: 블록의 ID 또는 인덱스)
      const blockKey = `block-${index}`;
      // 색상이 이미 할당되지 않았다면 새 색상을 생성
      if (!blockColors[blockKey]) {
        newBlockColors[blockKey] = getRandomColor();
      }
    });
    // 새로운 색상 매핑을 상태에 저장
    if (Object.keys(newBlockColors).length > 0) {
      setBlockColors(prevColors => ({ ...prevColors, ...newBlockColors }));
    }
  }, [blocks]); // blocks가 변경될 때마다 실행
  useEffect(() => {
    const timerId = setInterval(() => {
      updateTime();
    }, 5000); // 매 초마다 현재 시간 업데이트

    return () => clearInterval(timerId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);
  function toLocalDateString(date) {
    const year = date.getFullYear();
    // getMonth()는 0부터 시작하므로 실제 월을 얻기 위해 1을 더함
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 월과 일이 한 자리 수일 경우 앞에 0을 붙여 두 자리 수로 만듦
    const paddedMonth = month < 10 ? `0${month}` : month;
    const paddedDay = day < 10 ? `0${day}` : day;
    return `${year}-${paddedMonth}-${paddedDay}`;
  }
  const currentTimeToAngle = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    console.log("current",currentTime);
    console.log("currentTimeToAngle",hours,minutes);
    return ((hours % 24) + (minutes / 60)) / 24 * 360;
  };
  const drawCurrentTimeMarker = () => {
    console.log("drawCurrentTimeMarker",currentTime);
    const currentDateString = toLocalDateString(new Date());
    console.log("check",currentDateString, selectedDate)
    if (currentDateString !== selectedDate) return null; // 선택된 날짜와 다르면 표시하지 않음
    const startAngle = timeToAngle("00:00");
    const endAngle = currentTimeToAngle();
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);

    const d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, 
      "L", cx, cy, 
      "Z"
    ].join(" ");

    return <path d={d} fillOpacity={0.5} stroke="red" strokeWidth="0.5" />;
  };

  const viewBoxSize = 150;
  const radius = 45; // 원의 반지름
  const cx = viewBoxSize / 2; // viewBox의 중앙으로 조정
  const cy = viewBoxSize / 2; // viewBox의 중앙으로 조정
  // 시간을 각도로 변환하는 함수
  const timeToAngle = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours % 24) + (minutes / 60)) / 24 * 360;
  };
  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360); // 0에서 359까지의 색조(hue) 값
    const saturation = 60 + Math.floor(Math.random() * 30); // 60%에서 90% 사이의 채도
    const lightness = 50 + Math.floor(Math.random() * 10); // 50%에서 60% 사이의 명도
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  // 시간 블록을 SVG 패스로 변환하는 함수
  const blockToPath = (block, index) => {
    const blockDate = block.date;
    
    if (blockDate !== selectedDate) return null; // 선택된 날짜와 다르면 표시하지 않음
    const startAngle = timeToAngle(block.startTime);
    const endAngle = timeToAngle(block.endTime);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const blockKey = `block-${index}`;
    const fillColor = blockColors[blockKey] || getRandomColor(); // 상태에서 색상을 가져옴


    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);

    const d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, 
      "L", cx, cy, 
      "Z"
    ].join(" ");

    return <path d={d} fill={fillColor} fillOpacity={0.5} stroke="black" strokeWidth="0.5" />;
  };

  // 극좌표를 카테시안 좌표로 변환하는 함수
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  const drawClockNumbers = () => {
    const numbers = [];
    const fontSize = viewBoxSize / 15; // 예시 비율, 조정 가능

    for (let hour = 1; hour <= 24; hour++) {
      const angle = (hour / 24) * 2 * Math.PI; // 시간에 따른 각도 계산 (라디안 단위)
      const numberRadius = radius + 10; // 숫자를 원 주위에 더 가깝게 배치하기 위해 반지름을 조정
      const x = cx + numberRadius * Math.cos(angle - Math.PI / 2); // 극좌표에서 카테시안 좌표로 변환
      const y = cy + numberRadius * Math.sin(angle - Math.PI / 2);
  
      numbers.push(
        <text
          x={x}
          y={y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={fontSize} // 동적으로 조정된 fontSize 사용
          fill="black"
        >
          {hour}
        </text>
      );
    }
    return numbers;
  };
  // 각 시간에 대한 각도를 계산하고, 그 위치에 작은 막대기를 그리는 함수
const drawClockMarkers = () => {
  const markers = [];
  for (let hour = 1; hour <= 24; hour++) {
    const angle = (hour / 24) * 2 * Math.PI; // 시간에 따른 각도 계산 (라디안 단위)
    const innerRadius = radius - 5; // 원에서 조금 안쪽으로
    const outerRadius = radius + 5; // 원에서 바깥쪽으로
    // 내부 꼭지점 좌표 (원에 더 가까움)
    const innerX = cx + innerRadius * Math.cos(angle - Math.PI / 2);
    const innerY = cy + innerRadius * Math.sin(angle - Math.PI / 2);
    // 외부 꼭지점 좌표 (원에서 바깥쪽)
    const outerX = cx + outerRadius * Math.cos(angle - Math.PI / 2);
    const outerY = cy + outerRadius * Math.sin(angle - Math.PI / 2);

    markers.push(
      <line x1={innerX} y1={innerY} x2={outerX} y2={outerY} stroke="black" strokeWidth="1" />
    );
  }
  return markers;
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <svg width="100%" height="auto" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} preserveAspectRatio="xMidYMid meet">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="black" />
        {drawClockMarkers()} {/* 작은 막대기 그리기 */}
        {blocks.map((block, index) => blockToPath(block, index))}
        {drawClockNumbers()} {/* 시계 숫자를 그리는 함수 호출 */}
        {drawCurrentTimeMarker()} {/* 현재 시간 마커 그리기 */}
      </svg>
    </div>
  );
}

export default TimeBlocksClock;