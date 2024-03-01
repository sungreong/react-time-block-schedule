import React, { Fragment, useCallback, useState, useEffect,useMemo } from 'react';
import { Calendar, momentLocalizer, Views,Navigate, DateLocalizer  } from 'react-big-calendar';
// import * as TimeGrid from 'react-big-calendar/lib/TimeGrid'
// import { Calendar,  } from 'react-big-calendar';
import PropTypes from 'prop-types';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
function MyCalendar({ blocks, setBlocks  }) {
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
      start: new Date(),
      end: new Date()
  });
  const [events, setEvents] = useState([]);
  useEffect(() => {
      if (blocks.length > 0) {
        // 모든 날짜를 타임스탬프로 변환합니다.
        const dates = blocks.map(block => moment(block.date).valueOf());
    
        // 가장 작은 타임스탬프(가장 빠른 날짜)와 가장 큰 타임스탬프(가장 늦은 날짜)를 찾습니다.
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
    
        // 상태를 업데이트합니다.
        setDateRange({
          start: minDate,
          end: maxDate,
        });
        setDefaultDate(minDate);
        console.log('minDate',minDate);
        console.log('maxDate',maxDate);
      }
    }, [blocks]);
  useEffect(() => {
      // blocks 데이터를 이벤트 데이터로 변환
      const newEvents = blocks.map(block => ({
        title: block.task,
        start: new Date(moment(block.date + 'T' + block.startTime).valueOf()),
        end: new Date(moment(block.date + 'T' + block.endTime).valueOf()),
        allDay: false
      }));
      setEvents(newEvents);
    }, [blocks]); // blocks 배열이 변경될 때마다 이 useEffect를 실행

        // Convert blocks to calendar events
  useEffect(() => {
    setEvents(blocks.map(block => ({
      ...block,
      start: new Date(moment(block.date + 'T' + block.startTime).valueOf()),
      end: new Date(moment(block.date + 'T' + block.endTime).valueOf()),
    })));
  }, [blocks]);
  const moveEvent = useCallback(
      ({ event, start, end }) => {
        setBlocks((currentBlocks) => {
          const idx = currentBlocks.findIndex((b) => b.id === event.id);
          const updatedBlock = { ...currentBlocks[idx], date: moment(start).format('YYYY-MM-DD'), startTime: moment(start).format('HH:mm'), endTime: moment(end).format('HH:mm') };
          const updatedBlocks = [...currentBlocks];
          updatedBlocks[idx] = updatedBlock;
          return updatedBlocks;
        });
      },
      [setBlocks]
    );

  const resizeEvent = useCallback(
        ({ event, start, end }) => {
        setBlocks((currentBlocks) => {
            const idx = currentBlocks.findIndex((b) => b.id === event.id);
            const updatedBlock = { ...currentBlocks[idx], startTime: moment(start).format('HH:mm'), endTime: moment(end).format('HH:mm') };
            const updatedBlocks = [...currentBlocks];
            updatedBlocks[idx] = updatedBlock;
            return updatedBlocks;
        });
        },
        [setBlocks]
    );

  const [currentView, setCurrentView] = useState('week'); // Default view    
  const views = {
    month: true,
    week: true,
    day: true,
  }
  
  
  return (
      <div className="height600">
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView={currentView} // 현재 뷰 상태를 사용
        events={events}
        localizer={localizer}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        resizable
        style={{ height: '100vh' }}
        views={views}
        // components={components}
        onView={setCurrentView} // 뷰가 변경될 때 currentView 상태 업데이트
      />
    </div>
  );
}

export default MyCalendar;
