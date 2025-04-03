import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(
    (req, res, next) => {
        upload.fields([
            { name: 'avatar', maxCount: 2 },
            { name: 'coverImage', maxCount: 2 }
        ])(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    error: err.message
                });
            }
            next();
        });
    },
    registerUser
);


export default router;