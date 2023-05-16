

import express from 'express';
import { login, signup, getMyProfile, logout, updateProfile, changePassword } from '../controllers/user.js';
import { isAuthenticated  } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();


// router.route("/login").get(login); // when you have to write multiple method together
router.post('/login', login)
router.post('/register',singleUpload, signup)
router.get('/me',isAuthenticated, getMyProfile)
router.get('/logout',isAuthenticated, logout)


// update profile and chaange password
router.put('/updateprofile', isAuthenticated, updateProfile)
router.put('/changepassword', isAuthenticated, changePassword)

// update picture
router.put('/updatepic', isAuthenticated,)

export default router;  