// backend/middleware/errorMiddleware.js

const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File size too large. Maximum file size is 10MB.' }); // Or whatever limit you set
        }
        // Handle other Multer errors if needed (e.g., LIMIT_FILE_COUNT, LIMIT_FIELD_KEY, etc.)
        return res.status(400).json({ message: `File upload error: ${err.message}` }); // Generic Multer error
    } else if (err) {
        // For other types of errors (non-Multer errors), pass to default error handler
        return next(err);
    }
    next(); // If no error, proceed to the next middleware/route handler
};

module.exports = errorHandler;