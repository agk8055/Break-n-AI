// frontend/src/pages/HomePage.jsx
import React from 'react';
import FileUploader from '../components/FileUploader';
import styles from './HomePage.module.css'; // Import CSS module

function HomePage() {
  return (
    <div className={styles.pageContainer}> {/* Apply pageContainer style */}
      <header className={styles.header}> {/* Apply header style */}
        <h1>BREAK'N AI</h1>
      </header>
      <main className={styles.mainContent}> {/* Apply mainContent style */}
        <FileUploader />
      </main>
    </div>
  );
}

export default HomePage;