// frontend/src/components/ExtractedTextViewer.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './ExtractedTextViewer.module.css'; // Import CSS module

function ExtractedTextViewer({ text }) {
    const [isCollapsed, setIsCollapsed] = useState(true); // State for collapse
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [text]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={toggleCollapse}>
                <h3 className={styles.headerText}>Extracted Text</h3>
                <span>{isCollapsed ? '+' : '-'}</span> {/* Collapse/Expand indicator */}
            </div>
            <div
                ref={contentRef}
                className={`${styles.content} ${isCollapsed ? styles.contentHidden : ''}`}
                style={{ maxHeight: isCollapsed ? 0 : contentHeight, transition: 'max-height 0.3s ease-out' }}
            >
                {text ? <div className="extracted-text-content">{text}</div> : <p className={styles.noText}>No text extracted yet.</p>}
            </div>
        </div>
    );
}

export default ExtractedTextViewer;