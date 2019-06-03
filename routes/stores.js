const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

const forge = require('node-forge');
const fs = require('fs');


router.post('/newStore', (req, res, next) => {
    let newStore = {
        seller: req.body.seller,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        description: req.body.description,
        number : req.body.number
    };

    CreateStoreQuery(newStore)        // Salt값 생성 함수 호출
        .then( function(query) {
            console.log("query : " + query)// CreateQuery함수에서 쿼리문을 반환
            return PoolGetConnection(query);    // PoolGetConnection에 쿼리문을 보냄
                                                // 커넥션을 얻는데 쿼리문은 필요가 없지만 뒤에 사용될 함수가 커넥션을 사용하므로 다음 함수에 쿼리문을 전달하기 위해서 쿼리문을 보냄
        })
        .then(function (connectionQuery) { // PoolGetConnection에서 커넥션과 쿼리문을 받음
            return ExecuteQuery(connectionQuery);   // ExecuteQuery함수에 커넥션과 쿼리문을 보냄
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + JSON.stringify(rows));
            return StoreComplete(res);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
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

router.post('/Product', (req, res, next) => {

    CreateProductFoundQuery()
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + JSON.stringify(rows));
            return GetProductComplete(res, rows);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
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

router.post('/Store', (req, res, next) => {

    CreateStoreFoundQuery()
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + JSON.stringify(rows));
            return GetStoreComplete(res, rows);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
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

router.post('/FoundEnt', (req, res, next) => {

    const number = req.body.number;

    CreateFoundEntQuery(number)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + JSON.stringify(rows[0]));
            return GetStoreComplete(res, rows[0]);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
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


router.post('/FindProduct', (req, res, next) => {

    const store = req.body.store;
    console.log("This Solutions is : " + store);

    CreateFindProductQuery(store)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + JSON.stringify(rows));
            return GetProductComplete(res, rows);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("나누기 1 err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
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

function CreateProductFoundQuery() {
    return new Promise( function (resolve) {
        let statement = "SELECT * FROM product";
        console.log("CreateStoreFoundQuery : "+statement);
        resolve(statement);
    });
}

function GetProductComplete(res, rows) {     // 프론트 엔드에 Success : true값을 반환하는 Promise 함수
    return new Promise( function () {
        res.json({
            success: true,
            Product : rows
        });
    });
}

function CreateStoreFoundQuery() {
    return new Promise( function (resolve) {
        let statement = "SELECT * FROM ent WHERE seller = 1";
        console.log("CreateStoreFoundQuery : "+statement);
        resolve(statement);
    });
}

function GetStoreComplete(res, rows) {     // 프론트 엔드에 Success : true값을 반환하는 Promise 함수
    return new Promise( function () {
        console.log('마지막 : '+ JSON.stringify(rows));
        res.json({
            success: true,
            store : rows
        });
    });
}

function CreateFoundEntQuery(number) {
    return new Promise( function (resolve) {
        let statement = "SELECT * FROM ent where number = " + number + ";";
        console.log("CreateFoundEntQuery : "+statement);
        resolve(statement);
    });
}

function CreateFindProductQuery(store) {
    return new Promise( function (resolve) {
        let statement = "SELECT * FROM product where user_number = " + store + ";";
        console.log("CreateFindProductQuery : "+statement);
        resolve(statement);
    });
}


var pool = mysql.createPool(config); //연결에 대한 풀을 만든다. 기본값은 10개

function CreateStoreQuery(newStore) {     //유저 정보, 해쉬화된 비밀번호를 받아서 쿼리문을 작성하는 Promise 함수
    return new Promise( function (resolve, reject) {
        if(newStore) {
            let statement = "INSERT INTO product (user_number, seller, name, price, quantity, category, description) VALUES ('" + newStore.number + "', '" + newStore.seller + "', '" + newStore.name + "', '" + newStore.price + "', '" + newStore.quantity + "', '" + newStore.category + "', '" + newStore.description + "');";
            resolve(statement);
        } else {
            console.log("CreateRegisterQuery err : "+err);
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


function StoreComplete(res) {     // 프론트 엔드에 Success : true값을 반환하는 Promise 함수
    return new Promise( function () {
        res.json({success: true, msg: 'User registed'});
    });
}

function Rollback(connection) {      // 쿼리문 에러시 롤백을 실행하는 Promise 함수
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