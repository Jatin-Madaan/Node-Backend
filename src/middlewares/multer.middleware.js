import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    // Define the storage location and filename format
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Store files in a dedicated uploads directory
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Math.round(Math.random() * 1E9);
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files per request
    }
});

export default upload;