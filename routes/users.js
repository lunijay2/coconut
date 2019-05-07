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
        tel: req.body.tel,
        addr: req.body.addr,
        email: req.body.email,
        indi: req.body.indi
    }

    //var connection = mysql.createConnection(config); //기존 DB 연결시 필요한 코드
    //connection.connect();

    let statement = "INSERT INTO user (name, id, password, tel, addr, email, indi) VALUES ('" + newUser.name + "', '" + newUser.id + "', '" + newUser.password + "', '" + newUser.tel + "', '" + newUser.addr + "', '" + newUser.email + "', " + newUser.indi + ");";

    //정석적인 DB연결 - 쿼리 수행
    pool.getConnection(function (err, connection) {
        if(!err){
            connection.query(statement, function(err, rows, fields) {
                if (!err) {
                    res.json({success: true, msg: 'User registed'});
                    console.log('The solution is: ', rows);
                } else {
                    connection.rollback(function (){ //쿼리가 에러로 실패하면 롤백해야 함
                        console.error('rollback error1');
                    });
                    res.json({success: false, msg: 'Failed to register user'});
                    console.log('Error while performing Query.', err);
                }
            });
        }
        connection.release(); //쿼리가 성공하던 실패하던 커넥션을 반환해야 함
    });

//우리가 하던 DB연결 - 쿼리 수행
/*
getConnection().query(statement, function(err, rows, fields) {
    if (!err) {
        res.json({success: true, msg: 'User registed'});
        console.log('The solution is: ', rows);
    } else {
        connection.rollback(function () {
            console.error('rollback error1');
        })
        res.json({success: false, msg: 'Failed to register user'});
        console.log('Error while performing Query.', err);
    }
}); */
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const id = req.body.id;
    const password = req.body.password;

    console.log(id);
    console.log(password);
    //let statement = "SELECT * FROM user";
    let statement = "SELECT * FROM user WHERE id='" + id + "';";

    //해당 유저가 존재하는지 DB에 쿼리로 확인
    pool.getConnection(function (err, connection) {
        if(!err){
            connection.query(statement, function(err, rows, fields) {
                if(err) {
                    console.log(err);
                    throw err;
                }
                if (!rows) {
                    console.log("User not found");
                    res.json({success: false, msg: 'User not found'});
                }
                console.log("User found");
                if (rows[0].password == password) {
                    console.log("비밀번호 일치");
                    console.log("로그인 성공");
                    //console.log(rows);
                    res.json({success: true, user:rows[0]});
                }
            });
        }
        else {
            console.log("errr");
            res.json({success: false, msg: 'failed'});
        }
        connection.release();
    });

});

// Profile
router.get('/profile', (req, res, next) => {
    res.send('프로필');
});

// Validate
router.get('/validate', (req, res, next) => {
    res.send('검증');
});

var pool = mysql.createPool(config); //연결에 대한 풀을 만든다. 기본값은 10개

//디비 연결 함수
//function getConnection(){
//    return pool
//}

module.exports = router;
