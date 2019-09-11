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
            return Complete( res, rows );
        })
        .catch(err => {
            console.log(err);
            res.json({success: false});
        })

});


router.post('/GetOrder_Camera',(req, res, next) => {

    let order_no = req.body.orderno;
    //let no = req.body.order_no.no;
    //let time1 = req.body.orderno.t;
    console.log('order_number : '+order_no);
    //console.log('no : '+no);
    //console.log('time1 : '+time1);
    //let order = JSON.parse(order_no);
    //console.log('JSON parser order : '+JSON.stringify(order));

    var o = order_no.split('/');
    console.log('o : '+JSON.stringify(o));

    OrderFoundQuery(order_no)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            return Complete( res, rows );
        })
        .catch(err => {
            console.log(err);
            res.json({success: false});
        })

});


router.post('/newOrder',(req, res, next) => {
    let newOrder = {
        product: req.body.product[0].product,
        price: req.body.product[0].price,
        orderer: req.body.orderer,
        delivery_address: req.body.delivery_address,
        delivery_tel: req.body.delivery_tel
    };
    console.log('newOrder : '+JSON.stringify(newOrder));

    CreateOrderQuery(newOrder)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            return Complete( res, rows );
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
            let statement = "SELECT * FROM trade_detail WHERE order_no=" + ordernumber + ";";
            console.log("OrderFoundQuery : "+statement);
            resolve(statement);
        } else {
            console.log("OrderFoundQuery err : "+err);
            reject(err);
        }
    });
}

function CreateOrderQuery(newOrder) {
    return new Promise( function (resolve) {
        let statement = "INSERT INTO trade_detail (product, price, orderer, paid, delivery_address, delivery_tel) VALUES ('" + newOrder.product + "', '" + newOrder.price + "', '" + newOrder.orderer + "', '" + 0 + "', '" + newOrder.delivery_address + "', '" + newOrder.delivery_tel + "');";
        console.log("newOrderQuery : "+statement);
        resolve(statement);
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

function Complete(res, rows) {
    return new Promise( function () {
        console.log('Success');
        res.json({success: true, order: rows});
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

var pool = mysql.createPool(config); //연결에 대한 풀을 만든다. 기본값은 10개

module.exports = router;