// frontend/src/pages/HomePage.jsx
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import AnswerDisplay from '../components/AnswerDisplay';
import ExtractedTextViewer from '../components/ExtractedTextViewer';
import SummaryDisplay from '../components/SummaryDisplay';
import QuestionInput from '../components/QuestionInput';
import styles from './HomePage.module.css';
import * as api from '../services/api';

function HomePage() {
  const [showComponents, setShowComponents] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSummarize = (response) => {
    setExtractedText(response.extractedText);
    setSummary(response.summary);
    setShowComponents(true);
  };

  const handleQuestionSubmit = async (question) => {
    try {
      const response = await api.askQuestion(summary, question);
      if (response.answer) {
        setAnswer(response.answer);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Error getting answer');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>BREAK'N AI</h1>
      </header>
      <main className={styles.mainContent}>
        <FileUploader onSummarize={handleSummarize} />
        {showComponents && (
          <>
            <ExtractedTextViewer text={extractedText} />
            <SummaryDisplay summary={summary} />
            <QuestionInput onQuestionSubmit={handleQuestionSubmit} />
            <AnswerDisplay answer={answer} />
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;