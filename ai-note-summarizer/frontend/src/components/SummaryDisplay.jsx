// frontend/src/components/SummaryDisplay.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './SummaryDisplay.module.css'; // Import CSS module

function SummaryDisplay({ summary }) {
  return (
    <div className={styles.container}> {/* Apply container style */}
      <h3 className={styles.title}>Summary:</h3> {/* Apply title style */}
      <div className={styles.content}> {/* Apply content style */}
        {summary ? (
          <ReactMarkdown children={summary} /> 
        ) : (
          <p className={styles.noSummary}>No summary available yet.</p> 
        )}
      </div>
    </div>
  );
}

export default SummaryDisplay;