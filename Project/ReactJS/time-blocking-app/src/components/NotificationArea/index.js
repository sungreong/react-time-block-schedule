import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationArea = ({ blocks }) =>{
    useEffect(() => {
        const checkTimeBlocksForNotification = () => {
          const now = new Date();
          blocks.forEach(block => {
            const startDateTime = new Date(`${block.date}T${block.startTime}`);
            const endDateTime = new Date(`${block.date}T${block.endTime}`);
            
            const startAlertMs = block.startAlertBefore * 60 * 1000;
            const endAlertMs = block.endAlertBefore * 60 * 1000;
            
    
            const timeUntilStart = startDateTime - now;
            if (timeUntilStart > 0 && timeUntilStart <= startAlertMs) {
              toast.info(`"${block.task}"가 ${block.startAlertBefore}분 이내로 시작됩니다.`);
            }
    
            const timeUntilEnd = endDateTime - now;
            if (timeUntilEnd > 0 && timeUntilEnd <= endAlertMs) {
              toast.done(`"${block.task}"가 ${block.endAlertBefore}분 이내로 종료됩니다.`);
            }
          });
        };
    
        const intervalId = setInterval(checkTimeBlocksForNotification, 60000);
        return () => clearInterval(intervalId);
      }, [blocks]);
}

export default NotificationArea;