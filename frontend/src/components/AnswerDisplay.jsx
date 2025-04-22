// frontend/src/components/AnswerDisplay.jsx
import React from 'react';
import styles from './AnswerDisplay.module.css'; // Import CSS module

function AnswerDisplay({ answer }) {
    return (
        <div className={styles.container}> {/* Apply container style */}
            <h3 className={styles.title}>Answer:</h3> {/* Apply title style */}
            <div className={styles.content}> {/* Apply content style */}
                {answer ? answer : <p className={styles.noAnswer}>No answer available yet. Ask a question above.</p>} {/* Apply noAnswer style */}
            </div>
        </div>
    );
}

export default AnswerDisplay;