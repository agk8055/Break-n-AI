// backend/controllers/summarizerController.js
const pdfParse = require('pdf-parse');
const tesseract = require('tesseract.js');  
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mammoth = require('mammoth'); 

// Access your API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });

const summarizeText = async (text) => {
    try {
        const prompt = `Summarize the following text concisely for study purposes. **Format the summary using Markdown**, including headings, bullet points, and bold text where appropriate to highlight key information:\n\n${text}`;

        const result = await model.generateContent([prompt]);
        const response = result.response;
        const summary = response.text();
        return summary;

    } catch (error) {
        console.error("Error summarizing text with Gemini API:", error); // <--- Make sure this is logging
        throw new Error(`Failed to summarize text: ${error.message || 'Unknown error'}`);
    }
};

const askQuestion = async (summary, question) => {
    try {
        const prompt = `Based on the following summary, answer the question concisely and directly:\n\nSummary:\n${summary}\n\nQuestion:\n${question}\n\nAnswer:`;

        const result = await model.generateContent([prompt]);
        const response = result.response;
        const answer = response.text();

        return answer;

    } catch (error) {
        console.error("Error asking question to Gemini API:", error);
        throw new Error(`Failed to get answer from Gemini API: ${error.message || 'Unknown error'}`);
    }
};





const extractTextFromFile = async (fileBuffer, mimeType, originalFilename) => {
    let extractedText = '';
    try {
        if (mimeType === 'application/pdf') {
            const pdfData = await pdfParse(fileBuffer);
            extractedText = pdfData.text;
        } else if (mimeType.startsWith('image/')) {
            const { data } = await tesseract.recognize(
                fileBuffer,
                'eng',
                {}
            );
            extractedText = data.text;
        } else if (mimeType === 'text/plain' || mimeType === 'text/csv') {
            extractedText = fileBuffer.toString('utf-8');
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') { // Handle PPTX
            const result = await mammoth.extractRawText({ buffer: fileBuffer }); // Use mammoth to extract text
            extractedText = result.value;
        }
        else {
            throw new Error('Unsupported file type.');
        }
        console.log('Text extracted successfully from:', originalFilename);
        return extractedText;
    } catch (error) {
        console.error('Error processing file:', originalFilename, error);
        throw new Error(`Error processing file: ${originalFilename}. ${error.message || 'Unknown error during extraction.'}`);
    }
};

const uploadFile = async (req, res) => { // Keep single file upload if you want
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const fileBuffer = req.file.buffer;
    const originalFilename = req.file.originalname;
    const mimeType = req.file.mimetype;

    try {
        const extractedText = await extractTextFromFile(fileBuffer, mimeType, originalFilename);
        const summary = await summarizeText(extractedText);

        return res.status(200).json({
            message: 'File uploaded and text extracted and summarized successfully!',
            filename: originalFilename,
            extractedText: extractedText,
            summary: summary,
        });

    } catch (error) {
        return res.status(500).json({
            message: `Error processing file: ${originalFilename}. ${error.message || 'Unknown error during processing.'}`,
            error: error.message || 'Unknown error'
        });
    }
};


const processText = async (req, res) => { // Keep text only processing if you want
    const text = req.body.text;

    if (!text) {
        return res.status(400).json({ message: 'No text provided.' });
    }

    try {
        const summary = await summarizeText(text);
        return res.status(200).json({
            message: 'Text processed and summarized successfully!',
            extractedText: text,
            summary: summary,
        });
    } catch (error) {
        console.error('Error processing text:', error);
        return res.status(500).json({
            message: `Error processing text. ${error.message || 'Unknown error during processing.'}`,
            error: error.message || 'Unknown error'
        });
    }
};


const processTextAndFiles = async (req, res) => {
    const text = req.body.text || ''; // Get text from request body, default to empty string
    const files = req.files || []; // Get files from request, default to empty array

    let combinedExtractedText = text; // Start with the user-entered text

    try {
        if (files && files.length > 0) {
            for (const file of files) {
                const extractedFromFile = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
                combinedExtractedText += "\n\n-- Document: " + file.originalname + " --\n\n" + extractedFromFile; // Separate text from different sources
            }
        }

        if (!combinedExtractedText.trim()) { // Check if combined text is empty after processing files and initial text
            return res.status(400).json({ message: 'No text or valid files provided for processing.' });
        }

        console.log("Text being sent for summarization:\n", combinedExtractedText);
        const summary = await summarizeText(combinedExtractedText);

        return res.status(200).json({
            message: 'Text and files processed and summarized successfully!',
            extractedText: combinedExtractedText, // Return combined extracted text
            summary: summary,
        });

    } catch (error) {
        console.error('Error processing text and files:', error);
        return res.status(500).json({
            message: `Error processing text and files. ${error.message || 'Unknown error during processing.'}`,
            error: error.message || 'Unknown error'
        });
    }
};


module.exports = {
    uploadFile, // Export single file upload if you keep it
    summarizeText,
    askQuestion,
    processText, // Export text only processing if you keep it
    processTextAndFiles, // Export the new combined processing function
};