// frontend/src/components/QuestionInput.jsx
import React, { useState } from 'react';
import styles from './QuestionInput.module.css'; // Import CSS module

function QuestionInput({ onQuestionSubmit }) {
    const [question, setQuestion] = useState('');

    const handleInputChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleSubmit = () => {
        if (question.trim()) {
            onQuestionSubmit(question);
            setQuestion('');
        } else {
            alert('Please enter a question.');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Check for Enter key press without Shift
            event.preventDefault(); // Prevent default form submission/newline in textarea
            handleSubmit();        // Trigger question submission
        }
    };

    return (
        <div className={styles.container}> {/* Apply container style */}
            <h3 className={styles.title}>Ask a Question about the Summary:</h3> {/* Apply title style */}
            <div className={styles.inputArea}> {/* Container for input and button */}
                <input
                    type="text" // Changed back to input type="text"
                    placeholder="Type your question here..."
                    value={question}
                    onChange={handleInputChange}
                    className={styles.input} // Apply input style
                    onKeyDown={handleKeyDown} // Handle Enter key submission
                />
                <button onClick={handleSubmit} className={styles.askButton}>Ask</button> {/* Apply askButton style */}
            </div>
        </div>
    );
}

export default QuestionInput;