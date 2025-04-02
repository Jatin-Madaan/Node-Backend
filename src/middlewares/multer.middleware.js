import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/temp/uploads'); // Set the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// File filter to allow only specific file types (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};

// Initialize multer with storage and file filter
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

export default upload;
