// backend/routes/summarizerRoutes.js
const express = require('express');
const multer = require('multer');
const summarizerController = require('../controllers/summarizerController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (adjust as needed)
    }
});


// POST /api/upload - Route for single file upload (you can keep this if you want, or remove)
router.post('/upload', upload.single('noteFile'), summarizerController.uploadFile);

// POST /api/process-text - Route for text only processing (you can keep this or remove)
router.post('/process-text', express.json(), summarizerController.processText);

// POST /api/process-all - Route for processing text and multiple files
router.post('/process-all', upload.array('noteFiles', 5), summarizerController.processTextAndFiles); // 'noteFiles' should match formData.append, max 5 files

// POST /api/ask - Route for question answering
router.post('/ask', express.json(), async (req, res) => {
    const { summary, question } = req.body;

    if (!summary || !question) {
        return res.status(400).json({ message: 'Summary and question are required.' });
    }

    try {
        const answer = await summarizerController.askQuestion(summary, question);
        return res.status(200).json({ answer: answer });
    } catch (error) {
        console.error('Error handling /api/ask request:', error);
        return res.status(500).json({ message: 'Error processing question.', error: error.message });
    }
});

module.exports = router;