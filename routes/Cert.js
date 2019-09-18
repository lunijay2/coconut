const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

const forge = require('node-forge');
const fs = require('fs');
const pki = forge.pki;
const caCertPem = fs.readFileSync('caCert.pem', 'utf8');
const caPrivateKeyPem = fs.readFileSync('caPrivateKey.pem', 'utf8');
const caCert = pki.certificateFromPem(caCertPem);
const caPrivateKey = pki.privateKeyFromPem(caPrivateKeyPem);


function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

router.post('/newCert', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let certinfo;

    let highestCertNumber;
    FindCertNumberHighestQuery(req.body.user.id)        // Salt값 생성 함수 호출
        .then( function(query) {
            //console.log("masterCert query : " + query);
            return PoolGetConnection(query);
        })
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("FindCertNumberHighest is : " + JSON.stringify(rows));
            highestCertNumber = rows[0].max_certnumber;
            console.log('highestCertNumber 1 : '+highestCertNumber);

            highestCertNumber = pad(highestCertNumber+1, 2);
            console.log('highestCertNumber 2 : '+highestCertNumber);

            var cert = pki.createCertificate();
            cert.publicKey = pki.publicKeyFromPem(req.body.publicKey);
            cert.serialNumber = highestCertNumber;
            cert.validity.notBefore = new Date();
            cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 5);

            console.log('cert serial : '+cert.serialNumber);

            var userAttrs = [
                {
                    name: 'commonName',
                    value: req.body.user.number
                }, {
                    name: 'countryName',
                    value: 'kr'
                }, {
                    name: 'organizationName',
                    value: 'Coconut'
                }, {
                    shortName: 'OU',
                    value: 'Master'
                }
            ];
            cert.setSubject(userAttrs);

            var caAttrs = [
                {
                    name: 'commonName',
                    value: caCert.subject.getField('CN').value
                }, {
                    name: 'countryName',
                    value: caCert.subject.getField('C').value
                }, {
                    shortName: 'ST',
                    value: caCert.subject.getField('ST').value
                }, {
                    name: 'localityName',
                    value: caCert.subject.getField('L').value
                }, {
                    name: 'organizationName',
                    value: caCert.subject.getField('O').value
                }, {
                    shortName: 'OU',
                    value: caCert.subject.getField('OU').value
                }
            ];
            cert.setIssuer(caAttrs);

            cert.setExtensions([
                {
                    name: 'basicConstraints',
                    cA: true
                }, {
                    name: 'keyUsage',
                    keyCertSign: true,
                    digitalSignature: true,
                    nonRepudiation: true,
                    keyEncipherment: true,
                    dataEncipherment: true
                }, {
                    name: 'extKeyUsage',
                    serverAuth: true,
                    clientAuth: true,
                    codeSigning: true,
                    emailProtection: true,
                    timeStamping: true
                }, {
                    name: 'nsCertType',
                    client: true,
                    server: true,
                    email: true,
                    objsign: true,
                    sslCA: true,
                    emailCA: true,
                    objCA: true
                }, {
                    name: 'subjectAltName',
                    altNames: [{
                        type: 6, // URI
                        value: 'http://coconutpay.herokuapp.com/'
                    }]
                }, {
                    name: 'subjectKeyIdentifier'
                }
            ]);

            cert.sign(caPrivateKey);

            certinfo = {
                cert : pki.certificateToPem(cert),
                caCert: caCertPem,
                user : req.body.user
            };
            return addMasterCertQuery(certinfo);
        }, function(err) {
            console.log("err 1 : "+err);
        })
        .then( function(query) {
            console.log("masterCert query : " + query);
            return PoolGetConnection(query);
        })
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return MasterCertComplete(res, certinfo);
        }, function(err) {
            console.log("err 1 : "+err);
            res.json({success: false, msg : err });
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg : err });
        });

});

function FindCertNumberHighestQuery(id) {
    return new Promise( function (resolve) {
        let statement = "SELECT MAX(certnumber) AS max_certnumber FROM cert_"+id+";";
        console.log("FindCertNumberHighestQuery : "+statement);
        resolve(statement);
    });
}

router.post('/AddCert', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    var cert = pki.createCertificate();
    cert.publicKey = pki.publicKeyFromPem(req.body.publicKey);
    cert.serialNumber = '01'; // 이 부분은 시리얼 넘버가 점점 올라가도록 해야 함
    cert.validity.notBefore = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    var userAttrs = [
        {
            name: 'commonName',
            value: req.body.user.number
        }, {
            name: 'countryName',
            value: 'kr'
        }, {
            name: 'organizationName',
            value: 'Coconut'
        }, {
            shortName: 'OU',
            value: req.body.deviceId //이 부분은 나중에 사용자가 입력한 기기 식별명으로 변경
        }
    ];
    cert.setSubject(userAttrs);

    var caAttrs = [
        {
            name: 'commonName',
            value: caCert.subject.getField('CN').value
        }, {
            name: 'countryName',
            value: caCert.subject.getField('C').value
        }, {
            shortName: 'ST',
            value: caCert.subject.getField('ST').value
        }, {
            name: 'localityName',
            value: caCert.subject.getField('L').value
        }, {
            name: 'organizationName',
            value: caCert.subject.getField('O').value
        }, {
            shortName: 'OU',
            value: caCert.subject.getField('OU').value
        }
    ];
    cert.setIssuer(caAttrs);

    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: true
        }, {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true
        }, {
            name: 'extKeyUsage',
            serverAuth: true,
            clientAuth: true,
            codeSigning: true,
            emailProtection: true,
            timeStamping: true
        }, {
            name: 'nsCertType',
            client: true,
            server: true,
            email: true,
            objsign: true,
            sslCA: true,
            emailCA: true,
            objCA: true
        }, {
            name: 'subjectAltName',
            altNames: [{
                type: 6, // URI
                value: 'http://coconutpay.herokuapp.com/'
            }]
        }, {
            name: 'subjectKeyIdentifier'
        }
    ]);

    cert.sign(caPrivateKey);

    let certinfo = {
        cert : pki.certificateToPem(cert),
        caCert: caCertPem,
        user : req.body.user
    };

    addMasterCertQuery(certinfo)        // Salt값 생성 함수 호출
        .then( function(query) {
            console.log("masterCert query : " + query);
            return PoolGetConnection(query);
        })
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return MasterCertComplete(res, certinfo);
        }, function(err) {
            console.log("err 1 : "+err);
            res.json({success: false, msg : err });
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg : err });
        });

});

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
            console.log("err 1 : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .then( function () {
            return ReleaseConnection( connectionQuery.connection );   // 결과값이 어떻든 커넥션은 반환되어야 한다
        })
        .catch(function (err) { //마지막으로 에러를 캐치
            console.log(err);
            res.json({success: false, msg: 'Failed to register user'});
        })
});

router.post('/GetProductDetail', (req, res, next) => {

    const productcode = req.body.productcode;

    CreateFindProductCodeQuery(productcode)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {  // ExecuteQuery가 쿼리문을 사용한 결과값을 받음
            console.log("This Solutions is : " + JSON.stringify(rows[0]));
            return Complete(res, rows[0]);    // RegComplete에 res를 보냄. res.json을 실행하기 위해서는 res값이 필요하기 때문에 res를 인자값으로 보냄
        }, function(err) {  // ExecuteQuery가 쿼리문을 실행한 결과로 에러가 온 경우
            console.log("Query Excute err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .catch( function (err) {    // 전체적으로 에러를 캐치한다
            console.log("Catch 1 err : "+err);
            res.json({success: false, msg: 'Failed to Get Product Detail'}); // 에러 캐치시 false반환
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
            console.log("Query Excute err : "+err);
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
            console.log("Query Excute err : "+err);
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
            console.log("Query Excute err : "+err);
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
            console.log("Query Excute err : "+err);
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .catch( function (err) {    // 전체적으로 에러를 캐치한다
            console.log("Catch 1 err : "+err);
            res.json({success: false, msg: 'Failed to Find ALL Product'}); // 에러 캐치시 false반환
        })
        .then( function () {
            return ReleaseConnection( connectionQuery.connection );   // 결과값이 어떻든 커넥션은 반환되어야 한다
        })
        .catch(function (err) { //마지막으로 에러를 캐치
            console.log(err);
        })

});

router.post('/FindCategory', (req, res, next) => {

    const category = req.body.category;
    console.log("category is : " + category);

    CreateFindCategoryQuery(category)
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
            return Rollback(connection); // 쿼리문 실행 중 에러가 나면 롤백을 실행해야 함
        })
        .catch( function (err) {    // 전체적으로 에러를 캐치한다
            console.log("Catch 1 err : "+err);
            res.json({success: false, msg: 'Failed to Found Category'}); // 에러 캐치시 false반환
        })
        .then( function () {
            return ReleaseConnection( connectionQuery.connection );   // 결과값이 어떻든 커넥션은 반환되어야 한다
        })
        .catch(function (err) { //마지막으로 에러를 캐치
            console.log(err);
        })

});

function CreateFindCategoryQuery(category) {
    return new Promise( function (resolve) {
        console.log('category : '+category);
        let statement = "SELECT * FROM product where category='"+category+"';";
        console.log("CreateFindCategoryQuery : "+statement);
        resolve(statement);
    });
}

function addMasterCertQuery(certinfo) {
    return new Promise( function (resolve) {
        let statement = "INSERT INTO cert_"+certinfo.user.id+" (masterCert, cert) VALUES ('" + 1 + "', '" + certinfo.cert + "');";
        console.log("addMasterCertQuery : "+statement);
        resolve(statement);
    });
}

function CreateProductFoundQuery() {
    return new Promise( function (resolve) {
        let statement = "SELECT * FROM product";
        console.log("ALLProductFoundQuery : "+statement);
        resolve(statement);
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

function CompleteResult(res, rows) {
    return new Promise( function () {
        console.log('성공 : '+ JSON.stringify(rows));
        res.json({
            success: true,
            result : rows
        });
    });
}

function MasterCertComplete(res, certinfo) {
    return new Promise( function () {
        console.log('성공 : '+ JSON.stringify(certinfo));
        res.json({
            success: true,
            Mcert : certinfo.cert,
            caCert : certinfo.caCert
        });
    });
}

function Complete(res) {     // 프론트 엔드에 Success : true값을 반환하는 Promise 함수
    return new Promise( function () {
        res.json({success: true, msg: 'Success'});
    });
}

function Rollback(connection) {
    return new Promise( function () {
        connection.rollback(function (){
            console.error('rollback error1');
        });
    });
}

function ReleaseConnection(connection) {
    return new Promise( function () {
        connection.release();
    });
}

var pool = mysql.createPool(config);

module.exports = router;