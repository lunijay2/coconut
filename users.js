const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

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
        //개인
    CreateSalt() // Salt값 생성 함수 호출
        .then(function(resSalt) { // CreateSalt 함수가 resSalt를 반환한 것을 받음
            return PasswordHash(resSalt, newUser.password); // PasswordHash 함수호출 resSalt, 패스워드를 같이 보냄
        })
        .then(function(resulthash) { //PasswordHash함수가 resulthash값을 반환
            var newUserHash = { //newUserHash에 유저정보, 해쉬화한 비밀번호를 json형태로 담는다
                newUser: newUser,
                hash: resulthash
            };
            return CreateQuery(newUserHash); // CreateQuery함수에 newUserHash를 보내며 호출
        })
        .then(function(query) { // CreateQuery함수에서 쿼리문을 반환
            return PoolGetConnection(query); // PoolGetConnection에 쿼리문을 보냄
            // 커넥션을 얻는데 쿼리문은 필요가 없지만 뒤에 사용될 함수가 커넥션을 사용하므로 다음 함수에 쿼리문을 전달하기 위해서 쿼리문을 보냄
        })
        .then(function(connectionQuery) { // PoolGetConnection에서 커넥션과 쿼리문을 받음
            return ExecuteQuery(connectionQuery); // ExecuteQuery함수에 커넥션과 쿼리문을 보냄
        })
        .then(function(rows, connection) { // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + rows[0]);
            return RegComplete(res); // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) { // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : " + err);
            return RegRollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .catch(function(err) { // 전체적으로 에러를 캐치한다
            console.log("Catch 1 err : " + err);
            res.json({ success: false, msg: 'Failed to register user' }); // 에러 캐치시 false반환
        })
        .then(function() {
            return ReleaseConnection(connection); // 결과값이 어떻든 커넥션은 반환되어야 한다
        })
        .catch(function(err) { //마지막으로 에러를 캐치
            console.log(err);
        })
});

// RegisterEnt
router.post('/registerEnt', (req, res, next) => {
    let newUser = {
        name: req.body.name,
        id: req.body.id,
        password: req.body.password,
        tel: req.body.tel,
        addr: req.body.addr,
        email: req.body.email,
        indi: req.body.indi,
        crn: req.body.crn,
        company: req.body.company,
        seller: req.body.seller
    }
    console.log(newUser);
    let connection1;
    //기업
    CreateSalt() // Salt값 생성 함수 호출
        .then(function(resSalt) { // CreateSalt 함수가 resSalt를 반환한 것을 받음
            return PasswordHash(resSalt, newUser.password); // PasswordHash 함수호출 resSalt, 패스워드를 같이 보냄
        })
        .then(function(resulthash) { //PasswordHash함수가 resulthash값을 반환
            var newUserHash = { //newUserHash에 유저정보, 해쉬화한 비밀번호를 json형태로 담는다
                newUser: newUser,
                hash: resulthash
            };
            return CreateQuery(newUserHash); // CreateQuery함수에 newUserHash를 보내며 호출
        })
        .then(function(query) { // CreateQuery함수에서 쿼리문을 반환
            return PoolGetConnection(query); // PoolGetConnection에 쿼리문을 보냄
            // 커넥션을 얻는데 쿼리문은 필요가 없지만 뒤에 사용될 함수가 커넥션을 사용하므로 다음 함수에 쿼리문을 전달하기 위해서 쿼리문을 보냄
        })
        .then(function(connectionQuery) {
            return ExecuteQuery(connectionQuery)
        })
        .then(function(rows) {
            var entuser = {
                ent_num: rows,
                newUser: newUser
            }
            return CreateQueryEnt(entuser);
        })
        .then(function(query) { // CreateQuery함수에서 쿼리문을 반환
            return PoolGetConnection(query); // PoolGetConnection에 쿼리문을 보냄
            // 커넥션을 얻는데 쿼리문은 필요가 없지만 뒤에 사용될 함수가 커넥션을 사용하므로 다음 함수에 쿼리문을 전달하기 위해서 쿼리문을 보냄
        })
        .then(function(connectionQuery) {
            return ExecuteQuery(connectionQuery)
        })
        .then(function(rows) { // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + rows[0]);
            return RegComplete(res); // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) { // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : " + err);
            return RegRollback(connection1); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .then(function() {
            return ReleaseConnection(connection1); // 결과값이 어떻든 커넥션은 반환되어야 한다
        })
        .catch(function(err) { //마지막으로 에러를 캐치
            console.log(err);
            res.json({ success: false, msg: 'Failed to register user' }); // 에러 캐치시 false반환
        })
});

/*
pool.getConnection(function(err, connection) {
    if (!err) {
        connection.query(statement, function(err, rows, fields) {
            if (!err) {
                //console.log(rows);
                let ent_num = rows.insertId;
                //console.log(ent_num);
                let statementBuyer = "INSERT INTO ent (number, crn, company, seller) VALUES ('" + ent_num + "','" + newUser.crn + "', '" + newUser.company + "', " + newUser.seller + ");";
                connection.query(statementBuyer, function(err2, rows2, fields2) {
                    if (!err2) {
                        console.log('EntUser registed');
                        console.log(rows2);
                        res.json({ success: true, msg: 'EntUser registed' });
                    } else {
                        connection.rollback(function() { //쿼리가 에러로 실패하면 롤백해야 함
                            console.error('rollback error2');
                        });
                        res.json({ success: false, msg: 'Failed to register EntUser' });
                        console.log('Error while performing Query.', err2);
                    }
                });
                console.log('The solution is: ', rows);
            } else {
                connection.rollback(function() { //쿼리가 에러로 실패하면 롤백해야 함
                    console.error('rollback error1');
                });
                res.json({ success: false, msg: 'Failed to register user' });
                console.log('Error while performing Query.', err);
            }
        });
    }
    connection.release(); //쿼리가 성공하던 실패하던 커넥션을 반환해야 함
});
*/
// Authenticate
router.post('/authenticate', (req, res, next) => {
    const id = req.body.id;
    const password = req.body.password;

    console.log(id);
    console.log(password);
    //let statement = "SELECT * FROM user";
    let statement = "SELECT * FROM user WHERE id='" + id + "';";

    //해당 유저가 존재하는지 DB에 쿼리로 확인
    pool.getConnection(function(err, connection) {
        if (!err) {
            connection.query(statement, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!rows) {
                    console.log("User not found");
                    res.json({ success: false, msg: 'User not found' });
                }
                console.log("User found");
                if (rows[0].password == password) {
                    console.log("비밀번호 일치");
                    console.log("로그인 성공");
                    //console.log(rows);
                    res.json({ success: true, user: rows[0] });
                }
            });
        } else {
            console.log("errr");
            res.json({ success: false, msg: 'failed' });
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

function CreateSalt() { //salt값을 생성하는 Promise 함수
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            if (salt) {
                console.log("CreateSalt : " + salt);
                resolve(salt);
            } else {
                console.log("CreateSalt err : " + err);
                reject(err);
            }
        });
    });
}

function PasswordHash(salt, pass) { //비밀번호를 해쉬화하는 Promise 함수
    return new Promise(function(resolve, reject) {
        bcrypt.hash(pass, salt, function(err, hash) {
            if (hash) {
                console.log("PasswordHash : " + hash);
                resolve(hash);
            } else {
                console.log("PasswordHash err : " + err);
                reject(err);
            }
        });
    });
}

function CreateQuery(newUserHash) { //유저 정보, 해쉬화된 비밀번호를 받아서 쿼리문을 작성하는 Promise 함수
    return new Promise(function(resolve, reject) {
        if (newUserHash) {
            let statement = "INSERT INTO user (name, id, password, tel, addr, email, indi) VALUES ('" + newUserHash.newUser.name + "', '" + newUserHash.newUser.id + "', '" + newUserHash.hash + "', '" + newUserHash.newUser.tel + "', '" + newUserHash.newUser.addr + "', '" + newUserHash.newUser.email + "', " + newUserHash.newUser.indi + ");";
            console.log(statement);
            resolve(statement);
        } else {
            console.log("CreateQuery err : " + err);
            reject(err);
        }
    });
}

function CreateQueryEnt(entuser) { //유저 정보, 해쉬화된 비밀번호를 받아서 쿼리문을 작성하는 Promise 함수
    return new Promise(function(resolve, reject) {
        if (entuser) {
            let statement = "INSERT INTO ent (number ,crn, company, seller) VALUES ('" + entuser.ent_num.insertId + "', '" + entuser.newUser.crn + "', '" + entuser.newUser.company + "', " + entuser.newUser.seller + ");";
            console.log(statement);
            resolve(statement, entuser.connection);
        } else {
            console.log("CreateQuery err : " + err);
            reject(err);
        }
    });
}

function PoolGetConnection(query) { //Pool에서 Connection을 가져오는 Promise 함수
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (connection) {
                console.log(query);
                var connectionQuery = {
                    connection: connection,
                    query: query
                }
                resolve(connectionQuery);
            } else {
                console.log("PoolGetConnection err : " + err);
                reject(err);
            }
        });
    });
}

function ExecuteQuery(ConQue) { // Connection과 쿼리문을 받아와서 실행하는 Promise 함수
    return new Promise(function(resolve, reject) {
        ConQue.connection.query(ConQue.query, function(err, rows, fields) {
            if (!err) {
                console.log("ExecuteQuery : " + rows[0] + rows[1]);
                resolve(rows);
            } else {
                console.log("ExecuteQuery err : " + err);
                reject(err);
            }
        });
    });
}

function RegComplete(res) { // 프론트 엔드에 Success : true값을 반환하는 Promise 함수
    return new Promise(function() {
        res.json({ success: true, msg: 'User registed' });
    });
}

function RegRollback(connection) { // 쿼리문 에러시 롤백을 실행하는 Promise 함수
    return new Promise(function() {
        connection.rollback(function() { //쿼리가 에러로 실패하면 롤백해야 함
            console.error('rollback error1');
        });
    });
}

function ReleaseConnection(connection) { // 쿼리문을 다 실행한 후 Connection을 반환하는 Promise 함수
    return new Promise(function() {
        connection.release();
    });
}

module.exports = router;