// frontend/src/components/FileUploader.jsx
import React, { useState, useRef } from 'react';
import styles from './FileUploader.module.css';
import * as api from '../services/api';

function FileUploader({ onSummarize }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [inputText, setInputText] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleAddDocumentClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadOrProcess = async () => {
        setUploadStatus('Processing...');

        const formData = new FormData();
        formData.append('text', inputText);

        selectedFiles.forEach((file) => {
            formData.append('noteFiles', file);
        });

        if (inputText.trim() === "" && selectedFiles.length === 0) {
            setUploadStatus('Please enter text or select at least one file to process.');
            return;
        }

        try {
            const response = await api.processTextAndFiles(formData);
            if (response.summary) {
                setUploadStatus('Processed and summarized successfully!');
                setSelectedFiles([]);
                setInputText('');
                
                if (onSummarize) {
                    onSummarize(response); // Pass the full response object
                }
            } else {
                setUploadStatus(`Processing failed. ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error processing text and files:", error);
            if (error.response && error.response.status === 413) {
                setUploadStatus(`Processing failed. ${error.response.data.message || 'File size is too large.'}`);
            } else if (error.response && error.response.data && error.response.data.message) {
                setUploadStatus(`Processing failed. ${error.response.data.message}`);
            } else {
                setUploadStatus('Processing failed. Network error.');
            }
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
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        accept=".pdf, .jpg, .jpeg, .png, .txt, .csv"
                    />
                </div>
                <p className={styles.supportedTypesText}>Maximum Size Limit: 10MB</p>
                <p className={styles.supportedTypesText}>Supported file types: PDF, JPG, JPEG, PNG, TXT, CSV</p>
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
        </div>
    );
}

export default FileUploader;