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
    let connection1;
    CreateSalt() // Salt값 생성 함수 호출
        .then(function(resSalt) { // CreateSalt 함수가 resSalt를 반환한 것을 받음
            return PasswordHash(resSalt, newUser.password); // PasswordHash 함수호출 resSalt, 패스워드를 같이 보냄
        })
        .then(function(resulthash) { //PasswordHash함수가 resulthash값을 반환
            var newUserHash = { //newUserHash에 유저정보, 해쉬화한 비밀번호를 json형태로 담는다
                newUser: newUser,
                hash: resulthash
            };
            return CreateRegisterQuery(newUserHash); // CreateQuery함수에 newUserHash를 보내며 호출
        })
        .then(function(query) { // CreateQuery함수에서 쿼리문을 반환
            return PoolGetConnection(query); // PoolGetConnection에 쿼리문을 보냄
            // 커넥션을 얻는데 쿼리문은 필요가 없지만 뒤에 사용될 함수가 커넥션을 사용하므로 다음 함수에 쿼리문을 전달하기 위해서 쿼리문을 보냄
        })
        .then(function(connectionQuery) {
            return ExecuteQuery(connectionQuery)
        })
        .then(function(rows) {
            console.log('CreateQueryEnt 직전 rows : '+JSON.stringify(rows));
            var entuser = {
                ent_num: rows,
                newUser: newUser
            };
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
            console.log("This Solutions is : " + JSON.stringify(rows));
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
                console.log("ExecuteQuery : "+ JSON.stringify(rows));
                resolve(rows);
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
