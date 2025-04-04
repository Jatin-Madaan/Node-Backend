import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

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

router.route('/login').post(loginUser);

// secured routes
router.route('/logout').post(verifyJWT ,logoutUser);



export default router;