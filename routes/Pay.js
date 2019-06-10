const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const passport_policy = require('../config/passport');
const bcrypt = require('bcryptjs');

router.post('/procpay',(req, res, next) => {
    let number = req.body.Payinfo.order_no;
    let jwt = req.body.token;
    let Statement;
    procpay(number, jwt)
});

router.post('/GetOrder',(req, res, next) => {
    let order_no = req.body.orderno;
    console.log('order_number : '+order_no);

    OrderFoundQuery(order_no)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            return LoginComplete( res, rows );
        })
        .catch(err => {
            console.log(err);
            res.json({success: false});
        })

});


function procpay(number, jwt) {
    return new Promise( function (resolve, reject) {
        let temp = passport_policy(jwt);
        console.log(temp);
    })
}

function OrderFoundQuery(ordernumber) {
    return new Promise( function (resolve, reject) {
        if(ordernumber) {
            let statement = "SELECT * FROM trade_detail WHERE order_no='" + ordernumber + "';";
            console.log("OrderFoundQuery : "+statement);
            resolve(statement);
        } else {
            console.log("OrderFoundQuery err : "+err);
            reject(err);
        }
    });
}

function PoolGetConnection(query) {     //Pool에서 Connection을 가져오는 Promise 함수
    return new Promise( function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if(connection){
                var connectionQuery = {
                    connection : connection,
                    query : query
                };
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
                console.log("query 실행 결과 : "+ JSON.stringify(rows));
                resolve(rows);
            } else {
                console.log("query 실행 err : "+err);
                reject(err);
            }
            ConQue.connection.release();
        });
    });
}

function Complete(res) {
    return new Promise( function () {
        res.json({success: true});
    });
}

function Rollback(connection) {      // 쿼리문 에러시 롤백을 실행하는 Promise 함수
    return new Promise( function () {
        connection.rollback(function () {
            console.error('rollback error');
        });
    });
}

function ReleaseConnection(connection) {    // 쿼리문을 다 실행한 후 Connection을 반환하는 Promise 함수
    return new Promise( function () {
        connection.release();
    });
}

module.exports = router;