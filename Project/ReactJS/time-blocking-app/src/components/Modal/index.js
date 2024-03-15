import React from 'react';
import TimeBlockForm from '../TimeBlockForm';
import styles from './Modal.module.css';
import FileUploader from '../FileUploader';
const Modal  = ({toggleModal, addBlocks, updateBlocksDate , handleFileChange , handleDownload }) => {
    return (    
    <div className={styles['modal']}>
          <div className={styles["modal-content"]}>
            <p><strong>타임 블로킹 목록 추가</strong></p>
            <TimeBlockForm 
            onSubmit={(blocks) => { addBlocks(blocks); toggleModal(); }} 
            onUpdateDate={updateBlocksDate} // 여기에 추가
            />
            <hr />
            <p><strong>파일로 불러오기(csv,json)</strong></p>
            <div style={{ marginBottom: "10px" }}>
            데이터 포맷:
            <ul>
              <li><code>date(YYYY-MM-DD)</code></li>
              <li><code>startTime(HH:MM)</code></li>
              <li><code>endTime(HH:MM)</code></li>
              <li><code>task(Any)</code></li>
            </ul>
            </div>
                  
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1vh', marginBottom: "1vh"}}>
            <FileUploader onLoadCallback={handleFileChange} />
            </div>
            <p></p>
            <hr />
            <p><strong>타임 블록 저장하기</strong></p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '1vh' , marginBottom: "1vh"}}>
              <button onClick={handleDownload}>Download Time Block</button>
            </div>
            <p></p>
            <hr /> 
            </div>
        </div>)
  };

export default Modal ;