const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
    let newUser = {
        name: req.body.name,
        id: req.body.id,
        password: req.body.password,
        tell: req.body.tell,
        addr: req.body.addr,
        email: req.body.email,
        indi: req.body.indi
    }

    var connection = mysql.createConnection(config);
    connection.connect();
    let statement = "INSERT INTO user (name, id, password, tell, addr, email, indi) VALUES ('" + newUser.name + "', '" + newUser.id + "', '" + newUser.password + "', '" + newUser.tell + "', '" + newUser.addr + "', '" + newUser.email + "', " + newUser.indi + ");";
    connection.query(statement, function(err, rows, fields) {
        if (!err) {
            res.json({success: true, msg: 'User registed'});
            console.log('The solution is: ', rows);
        } else {
            res.json({success: false, msg: 'Failed to register user'});
            console.log('Error while performing Query.', err);
        }
    });
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
