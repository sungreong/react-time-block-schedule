import React from "react";
import TimeBlockOptions from "../TimeBlockOptions";
import MyCalendar from "../Calendar";

const MainContent = ({
    tempRemoveBlock ,
    selectedOption,
    uniqueDates,
    blocks,
    selectedDate,
    setSelectedDate,
    deleteBlock,
    updateBlock,
    setBlocks,
    tempRemovedBlocks,
    restoreBlock,
    permanentlyRemoveBlock
  }) => {
    return (
      <>
        {selectedOption === 'timeBlocks' && (
          <TimeBlockOptions
            tempRemoveBlock={tempRemoveBlock}
            uniqueDates={uniqueDates}
            blocks={blocks}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            deleteBlock={deleteBlock}
            updateBlock={updateBlock}
            tempRemovedBlocks={tempRemovedBlocks}
            restoreBlock={restoreBlock}
            permanentlyRemoveBlock={permanentlyRemoveBlock}
          />
        )}
        {selectedOption === 'calendar' && (
          <MyCalendar blocks={blocks} setBlocks={setBlocks} />
        )}
      </>
    );
  };
  
  export default MainContent;