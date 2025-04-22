// frontend/src/components/FileUploader.jsx
import React, { useState, useRef } from 'react'; // Import useRef
import ExtractedTextViewer from './ExtractedTextViewer';
import SummaryDisplay from './SummaryDisplay';
import QuestionInput from './QuestionInput';
import AnswerDisplay from './AnswerDisplay';
import styles from './FileUploader.module.css'; // Import CSS module
import * as api from '../services/api'; // Import API service

function FileUploader() {
    const [selectedFiles, setSelectedFiles] = useState([]); // Array to hold multiple files
    const [uploadStatus, setUploadStatus] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [summary, setSummary] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionStatus, setQuestionStatus] = useState('');
    const [inputText, setInputText] = useState('');
    const fileInputRef = useRef(null); // Ref for the hidden file input

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to array
        setSelectedFiles([...selectedFiles, ...files]); // Add new files to existing array
    };

    const handleAddDocumentClick = () => {
        fileInputRef.current.click(); // Programmatically trigger file input
    };

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
    };


    const handleUploadOrProcess = async () => {
        setUploadStatus('Processing...');
        setExtractedText('');
        setSummary('');
        setAnswer('');
        setQuestionStatus('');

        const formData = new FormData();
        formData.append('text', inputText); // Append text input

        selectedFiles.forEach((file) => {
            formData.append('noteFiles', file); // Append each selected file
        });

        if (inputText.trim() === "" && selectedFiles.length === 0) {
            setUploadStatus('Please enter text or select at least one file to process.');
            return;
        }


        try {
            const response = await api.processTextAndFiles(formData); // Call API to process text and files
            if (response.summary) {
                setUploadStatus('Processed and summarized successfully!');
                setExtractedText(response.extractedText); // Combined extracted text
                setSummary(response.summary);
                setSelectedFiles([]); // Clear selected files after successful process (optional)
                setInputText(''); // Clear text input after successful process (optional)
            } else {
                setUploadStatus(`Processing failed. ${response.message || 'Unknown error'}`); // Default error message
            }
        } catch (error) {
            console.error("Error processing text and files:", error);
            if (error.response && error.response.status === 413) { // Check for 413 status (Payload Too Large)
                setUploadStatus(`Processing failed. ${error.response.data.message || 'File size is too large.'}`); // Display specific message
            } else if (error.response && error.response.data && error.response.data.message) {
                setUploadStatus(`Processing failed. ${error.response.data.message}`);
            } else {
                setUploadStatus('Processing failed. Network error.');
            }
        }
    };


    const handleQuestionSubmit = async (question) => {
        if (!summary) {
            alert('Please process text/files and summarize first before asking questions.');
            return;
        }

        setQuestionStatus('Getting answer...');
        setAnswer('');

        try {
            const response = await api.askQuestion(summary, question);
            if (response.answer) {
                setAnswer(response.answer);
                setQuestionStatus('');
            } else {
                setAnswer('');
                setQuestionStatus(`Question answering failed. ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Question answering error:', error);
            setAnswer('');
            setQuestionStatus('Question answering failed. Network error.');
        }
    };

    return (
        <div className={styles.container}>


            <div className={styles.inputArea}>
                <textarea
                    placeholder="Enter text here or add documents (PDF, images, text files)..."
                    value={inputText}
                    onChange={handleTextChange}
                    className={styles.textAreaInput}
                />
                <div className={styles.fileActions}>
                    <button
                        className={styles.addDocumentButton}
                        onClick={handleAddDocumentClick}
                    >
                        + Add Document
                    </button>
                    <input
                        type="file"
                        multiple // Allow multiple file selection
                        onChange={handleFileSelect}
                        style={{ display: 'none' }} // Hide the actual file input
                        ref={fileInputRef} // Attach the ref
                        accept=".pdf, .jpg, .jpeg, .png, .txt, .csv" // Optional: restrict accepted file types in file input
                    />
                </div>
                <p className={styles.supportedTypesText}>Maximum Size Limit: 10MB</p>
                <p className={styles.supportedTypesText}>Supported file types: PDF, JPG, JPEG, PNG, TXT, CSV
                    
                </p>
                
            </div>

            {selectedFiles.length > 0 && (
                <div className={styles.selectedFilesList}>
                    <p>Selected Files:</p>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>
                                {file.name}
                                <button
                                    className={styles.removeFileButton}
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            <button onClick={handleUploadOrProcess} className={styles.processButton}>
                Summarize
            </button>

            {uploadStatus && <p className={`${styles.status} status-message`}>{uploadStatus}</p>}
            <ExtractedTextViewer text={extractedText} />
            <SummaryDisplay summary={summary} />
            <QuestionInput onQuestionSubmit={handleQuestionSubmit} />
            {questionStatus && <p className={`${styles.status} status-message`}>{questionStatus}</p>}
            <AnswerDisplay answer={answer} />
        </div>
    );


}

export default FileUploader;