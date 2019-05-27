const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const bcrypt = require('bcryptjs');



router.post('/pay',(req, res, next) => {
    let number = req.body.Payinfo.order_no;
    let jwt = req.body.token;
    let Statement;


    ProcPay(number, jwt)


});

function ProcPay(number, jwt) {
    //jwt.
}

module.exports = router;