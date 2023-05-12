

import express from 'express';
import { login, signup } from '../controllers/user.js';

const router = express.Router();


// router.route("/login").get(login); // when you have to write multiple method together
router.post('/login', login)
router.post('/register', signup)

export default router;  