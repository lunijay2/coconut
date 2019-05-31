const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const passport_policy = require('../config/passport');
const bcrypt = require('bcryptjs');



router.post('/pay',(req, res, next) => {
    let number = req.body.Payinfo.order_no;
    let jwt = req.body.token;
    let Statement;


    procpay(number, jwt)


});

function procpay(number, jwt) {
    let temp = passport_policy(jwt);
    console.log(temp);
}

module.exports = router;