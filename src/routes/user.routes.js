import { Router } from 'express';
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    getUserChannelProfile,
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateAvatar, 
    updateCoverImage } from '../controllers/user.controller.js';
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
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);

router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router.route('/avatar').patch(verifyJWT, (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        next();
    });
}, updateAvatar);

router.route('/cover-image').patch(verifyJWT, (req, res, next) => {
    upload.single("coverImage")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        next();
    });
}, updateCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;