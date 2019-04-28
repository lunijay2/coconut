const express = require('express');
const router = express.Router();

// Register
router.get('/register', (req, res, next) => {
    res.send('등록하기');
});

// Authenticate
router.get('/authenticate', (req, res, next) => {
    res.send('인증');
});

// Profile
router.get('/profile', (req, res, next) => {
    res.send('프로필');
});

// Validate
router.get('/validate', (req, res, next) => {
    res.send('검증');
});

module.exports = router;
