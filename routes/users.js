const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

const forge = require('node-forge');
const fs = require('fs');

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
    };

    CreateSalt()        // Salt값 생성 함수 호출
        .then( function (resSalt) {   // CreateSalt 함수가 resSalt를 반환한 것을 받음
            return PasswordHash(resSalt, newUser.password);   // PasswordHash 함수호출 resSalt, 패스워드를 같이 보냄
        })
        .then(function (resulthash) {   //PasswordHash함수가 resulthash값을 반환
            var newUserHash = {     //newUserHash에 유저정보, 해쉬화한 비밀번호를 json형태로 담는다
                newUser: newUser,
                hash : resulthash
            };
            return CreateRegisterQuery(newUserHash);    // CreateQuery함수에 newUserHash를 보내며 호출
        })
        .then( function(query) {    // CreateQuery함수에서 쿼리문을 반환
            return PoolGetConnection(query);    // PoolGetConnection에 쿼리문을 보냄
                                                // 커넥션을 얻는데 쿼리문은 필요가 없지만 뒤에 사용될 함수가 커넥션을 사용하므로 다음 함수에 쿼리문을 전달하기 위해서 쿼리문을 보냄
        })
        .then(function (connectionQuery) { // PoolGetConnection에서 커넥션과 쿼리문을 받음
            return ExecuteQuery(connectionQuery);   // ExecuteQuery함수에 커넥션과 쿼리문을 보냄
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + rows[0]);
            return RegComplete(res);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
            }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : "+err);
            return RegRollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .catch( function (err) {    // 전체적으로 에러를 캐치한다
            console.log("Catch 1 err : "+err);
            res.json({success: false, msg: 'Failed to register user'}); // 에러 캐치시 false반환
        })
        .then( function () {
            return ReleaseConnection( connectionQuery.connection );   // 결과값이 어떻든 커넥션은 반환되어야 한다
        })
        .catch(function (err) { //마지막으로 에러를 캐치
            console.log(err);
        })

    /*
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) {
                console.log(err);
                throw err;
            }
            newUser.password = hash;
            console.log("해쉬화된 비밀번호 : "+newUser.password);
        });
    });
    */

    //var connection = mysql.createConnection(config); //기존 DB 연결시 필요한 코드
    //connection.connect();

    //let statement = "INSERT INTO user (name, id, password, tel, addr, email, indi) VALUES ('" + newUser.name + "', '" + newUser.id + "', '" + resulthash + "', '" + newUser.tel + "', '" + newUser.addr + "', '" + newUser.email + "', " + newUser.indi + ");";

    //정석적인 DB연결 - 쿼리 수행
    /*
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
    */

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
    };

    console.log(newUser);

    let statement = "INSERT INTO user (name, id, password, tel, addr, email, indi) VALUES ('" + newUser.name + "', '" + newUser.id + "', '" + newUser.password + "', '" + newUser.tel + "', '" + newUser.addr + "', '" + newUser.email + "', " + newUser.indi + ");";

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
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const id = req.body.id;
    const password = req.body.password;
    console.log("입력받은 id : " + id);
    console.log("입력받은 password : " + password);

    CreateUserFoundQuery(id)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then(rows => {
            console.log("User Found Solutions is : " + rows);
            return BcryptCompare(password, rows);
        })
        .then( isMatch => {
            return CreateAuthToken(isMatch.user);
        })
        .then( AuthToken => {
            return LoginComplete( res, AuthToken );
        })
        .catch(err => {
            console.log(err);
            res.json({success: false, msg: 'Failed to Login User'});
        })

    /*
    //let statement = "SELECT * FROM user";

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
                else {
                    console.log("User found");
                    console.log(rows);

                    bcrypt.compare(password, rows[0].password, function(err, isMatch) {
                        if (err) throw err;
                        if (isMatch) {
                            console.log("비밀번호 일치");
                            const ptoken = 'JWT '+jwt.sign(
                                { data : rows[0] },     //데이터에 사용자 객체 넣음
                                config.secret,      //database.js의 secret을 비밀키로 사용
                                { expiresIn : 259200 }  //유효기간 3일
                            );
                            console.log("공개토큰값 : ", ptoken);

                            const stoken = 'JWT '+jwt.sign(
                                {data:ptoken},//내용에 공개토큰 넣음
                                config.secret,//database.js의 secret을 비밀키로 사용
                                {noTimestamp: true}//유효기간 무제한
                            );
                            console.log("비밀토큰값 : ", stoken);

                            console.log("로그인 성공");
                            res.json({
                                success : true,
                                user : {
                                    name: rows[0].name,
                                    id: rows[0].id,
                                    tel: rows[0].tel,
                                    addr: rows[0].addr,
                                    email: rows[0].email,
                                    indi: rows[0].indi
                                },
                                ptoken : ptoken,
                                stoken : stoken
                            });
                        }
                        else {
                            console.log("로그인 실패");
                            res.json({success: false, msg: 'Password not Match'});
                        }
                    });
                }
            });
        }
        else {
            console.log("err");
            res.json({success: false, msg: 'failed'});
        }
        connection.release();
    });
    */
});

// Profile
router.get('/profile', passport.authenticate("jwt", {session: false}), function(req, res) {

    const ptoken = req.headers.authorization;
    const currT = req.headers.ctime;
    const auth = req.headers.auth;
    delete req.user.password;
    //console.log('delete pass : '+ JSON.stringify(req.user));

    const stoken = 'JWT '+jwt.sign({data: ptoken}, config.secret, {
        noTimestamp: true
    });

    var md = forge.md.sha256.create();
    md.update(currT+stoken);
    const auth2 = md.digest().toHex();
    const serverTime = new Date().getTime();
    const diff = serverTime - currT;
    console.log('수신한 일회용 인증 : '+auth);
    console.log('계산한 일회용 인증 : '+auth2);
    console.log('시간 차이 : '+diff);
    if(auth == auth2 && diff<100000){
        res.json({user: req.user});
    }
});

// Validate
router.get('/validate', (req, res, next) => {
    res.json('검증');
});

var pool = mysql.createPool(config); //연결에 대한 풀을 만든다. 기본값은 10개

function CreateSalt() {     //salt값을 생성하는 Promise 함수
    return new Promise( function (resolve, reject) {
        bcrypt.genSalt(10, function (err, salt) {
            if (salt) {
                console.log("CreateSalt : "+salt);
                resolve(salt);
            } else {
                console.log("CreateSalt err : "+err);
                reject(err);
            }
        });
    });
}

function PasswordHash(salt, pass) {     //비밀번호를 해쉬화하는 Promise 함수
    return new Promise( function (resolve, reject) {
        bcrypt.hash(pass, salt, function (err, hash) {
            if (hash) {
                console.log("PasswordHash : "+hash);
                resolve(hash);
            } else {
                console.log("PasswordHash err : "+err);
                reject(err);
            }
        });
    });
}

function CreateRegisterQuery(newUserHash) {     //유저 정보, 해쉬화된 비밀번호를 받아서 쿼리문을 작성하는 Promise 함수
    return new Promise( function (resolve, reject) {
        if(newUserHash) {
            let statement = "INSERT INTO user (name, id, password, tel, addr, email, indi) VALUES ('" + newUserHash.newUser.name + "', '" + newUserHash.newUser.id + "', '" + newUserHash.hash + "', '" + newUserHash.newUser.tel + "', '" + newUserHash.newUser.addr + "', '" + newUserHash.newUser.email + "', " + newUserHash.newUser.indi + ");";
            resolve(statement);
        } else {
            console.log("CreateRegisterQuery err : "+err);
            reject(err);
        }
    });
}

function CreateUserFoundQuery(Userid) {     //유저 정보, 해쉬화된 비밀번호를 받아서 쿼리문을 작성하는 Promise 함수
    return new Promise( function (resolve, reject) {
        if(Userid) {
            let statement = "SELECT * FROM user WHERE id='" + Userid + "';";
            console.log("CreateUserFoundQuery : "+statement);
            resolve(statement);
        } else {
            console.log("CreateUserFoundQuery err : "+err);
            reject(err);
        }
    });
}

function PoolGetConnection(query) {     //Pool에서 Connection을 가져오는 Promise 함수
    return new Promise( function (resolve, reject) {
        console.log("PoolGetConnection 1");
        pool.getConnection(function (err, connection) {
            if(connection){
                var connectionQuery = {
                    connection : connection,
                    query : query
                };
                console.log("PoolGetConnection 2");
                resolve(connectionQuery);
            } else {
                console.log("PoolGetConnection err : "+err);
                reject(err);
            }
        });
    });
}

function ExecuteQuery(ConQue) {     // Connection과 쿼리문을 받아와서 실행하는 Promise 함수
    return new Promise( function (resolve, reject) {
        ConQue.connection.query(ConQue.query, function(err, rows, fields) {
            if (!err) {
                console.log("ExecuteQuery : "+ rows[0] + rows[1]);
                resolve(rows[0]);
            } else {
                console.log("ExecuteQuery err : "+err);
                reject(err);
            }
            ConQue.connection.release();
        });
    });
}

function BcryptCompare ( password, User ) {
    return new Promise( function (resolve, reject) {

        console.log("BcryptCompare가 받은 User : "+ User.id);

        bcrypt.compare(password, User.password, function(err, isMatch) {
           if (isMatch) {
               console.log("BcryptCompare : "+ isMatch);
               let isMatchUser = {
                   result : isMatch,
                   user : User
               };
               resolve(isMatchUser);
           } else {
               console.log("BcryptCompare err : "+ err);
               reject(err);
           }
        });
    });
}

function CreateAuthToken(User) {
    return new Promise( function ( resolve ) {
        const ptoken = 'JWT '+jwt.sign(
            { data : User },
            config.secret,
            { expiresIn : 86400 * 7 }   //유효기간 7일
        );
        console.log("공개 토큰값 : ", ptoken);

        const stoken = 'JWT '+jwt.sign(
            { data : ptoken },
            config.secret,
            { noTimestamp : true } //유효기간 무제한
        );
        console.log("비밀 토큰값 : ", stoken);

        let AuthToken = {
            ptoken : ptoken,
            stoken : stoken,
            user : User
        };
        resolve(AuthToken);
    })
}

function LoginComplete( res, AuthToken ) {
    return new Promise( function () {
        res.json({
            success : true,
            user : {
                name: AuthToken.user.name,
                id: AuthToken.user.id,
                tel: AuthToken.user.tel,
                addr: AuthToken.user.addr,
                email: AuthToken.user.email,
                indi: AuthToken.user.indi
            },
            ptoken : AuthToken.ptoken,
            stoken : AuthToken.stoken
        });
        console.log('AuthToken name : '+ AuthToken.user.name);
        console.log("User Login Complete");
    })
}

function RegComplete(res) {     // 프론트 엔드에 Success : true값을 반환하는 Promise 함수
    return new Promise( function () {
        res.json({success: true, msg: 'User registed'});
    });
}

function RegRollback(connection) {      // 쿼리문 에러시 롤백을 실행하는 Promise 함수
    return new Promise( function () {
        connection.rollback(function (){ //쿼리가 에러로 실패하면 롤백해야 함
            console.error('rollback error1');
        });
    });
}

function ReleaseConnection(connection) {    // 쿼리문을 다 실행한 후 Connection을 반환하는 Promise 함수
    return new Promise( function () {
        connection.release();
    });
}

module.exports = router;
