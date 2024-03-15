import React from "react";
import { formatTime } from "../../utils/formatTime";

const FileUploader = ({ onLoadCallback }) => {
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        if (file.name.endsWith('.csv')) {
          const normalizedContent = content.replace(/\r\n/g, '\n');
          const rows = normalizedContent.split('\n');
          const headers = rows[0].split(',').map(header => header.trim().replace(/\r/g, ''));
  
          if (headers.length !== 4 || headers[0] !== 'date' || headers[1] !== 'startTime' || headers[2] !== 'endTime' || headers[3] !== 'task') {
            alert('CSV 파일의 형식이 올바르지 않습니다.');
            return;
          }
  
          const jsonData = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim());
            return {
              date: values[0],
              startTime: formatTime(values[1]),
              endTime: formatTime(values[2]),
              task: values[3],
              // Optional fields, ensure these exist in your application or adjust accordingly
              startAlertBefore: values[4] || undefined,
              endAlertBefore: values[5] || undefined,
            };
          }).filter(block => block.date); // Filter out any empty rows
  
          onLoadCallback(jsonData);
        } else if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          onLoadCallback(data);
        } else {
          alert('지원되지 않는 파일 형식입니다.');
        }
      };
  
      reader.readAsText(file);
    };
  
    return (
      <div>
        <input type="file" onChange={handleFileChange} accept=".csv, application/json" />
      </div>
    );
  };
  
  export default FileUploader;