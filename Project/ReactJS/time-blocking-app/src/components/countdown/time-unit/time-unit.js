import React from 'react';
import { oneOf, number } from 'prop-types';
import styled from 'styled-components';

const DAYS = 'days';
const HOURS = 'hours';
const MINUTES = 'minutes';
const SECONDS = 'seconds';

const TIME_UNIT_NAMES = {
  [DAYS]: 'Days',
  [HOURS]: 'Hours',
  [MINUTES]: 'Minutes',
  [SECONDS]: 'Seconds'
};


const TimeUnitContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const KeyLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const ValueDisplay = styled.span`
  font-size: 48px;
  font-weight: 800;
`;

const TimeUnit = ({ duration, value }) => {
  return (
    <TimeUnitContainer>
      <KeyLabel>{TIME_UNIT_NAMES[duration]}</KeyLabel>
      <ValueDisplay>{value}</ValueDisplay>
    </TimeUnitContainer>
  );
};

TimeUnit.propTypes = {
  duration: oneOf(Object.keys(TIME_UNIT_NAMES)).isRequired,
  value: number.isRequired
};

export { TimeUnit };
