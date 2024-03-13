import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { TimeUnit } from './time-unit';
import styled from 'styled-components';

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Delimiter = styled.div`
  font-size: 36px;
  font-weight: 400;
  margin: 0 10px;
`;

const Countdown = ({startdate , enddate}) => {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    let interval = null;
    if (enddate) {
      interval = setInterval(() => {
        const now = moment();
        if (moment(startdate).isAfter(now)) {
            clearInterval(interval);
            return ;
            }
        if (moment(enddate).isBefore(now)) {
          clearInterval(interval);
          return ;
        }
        const duration = moment.duration(moment(enddate).subtract(now));
        setDurations({
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds()
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [enddate]);
  const durationKeys = Object.keys(durations);
  return (
    <>
      <CountdownContainer>
        {durationKeys.map((key, index) => (
          <>
            <TimeUnit duration={key} value={durations[key]} />
            {index !== durationKeys.length - 1 && <Delimiter>:</Delimiter>}
          </>
        ))}
      </CountdownContainer>
    </>
  );
};

export { Countdown };
