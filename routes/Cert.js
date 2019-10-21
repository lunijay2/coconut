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

            console.log('cert : '+JSON.stringify(cert));

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

function FindCertNumberQuery(id, deviceID) {
    return new Promise( function (resolve) {
        let statement = "SELECT certnumber FROM cert_"+id+" WHERE deviceID='"+deviceID+"';";
        console.log("FindCertNumberQuery : "+statement);
        resolve(statement);
    });
}

function addAdditionalTempCertQuery(certinfo) {
    return new Promise( function (resolve) {
        let statement = "INSERT INTO cert_"+certinfo.user.id+" (masterCert, cert, deviceID) VALUES ('" + 0 + "', '" + certinfo.publicKey + "', '" + certinfo.deviceID + "');";
        console.log("addAdditionalCert Query : "+statement);
        resolve(statement);
    });
}

router.post('/AddCertAllowCheck', (req, res, next) => {

    console.log(JSON.stringify(req.body));

    let statement = 'SELECT cert, allowed, disable, deviceID FROM cert_'+req.body.id+' WHERE deviceID="'+req.body.deviceID+'";';

    PoolGetConnection(statement)
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function (rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));

            if (JSON.stringify(rows) === '[]') {
                console.log('rows = []');
                console.log('Additional Cert Validate False');
                res.json({success: false, msg: 'Additional Cert Validate False'});
            } else {
                //else if (rows[0].deviceID == req.body.deviceId) {
                return ResponseComplete(res, rows);
            }

        }, function (err) {
            console.log("err 1 : " + err);
            res.json({success: false, msg: err});
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: err});
        });

});

router.post('/CertCheck', (req, res, next) => {

    console.log(JSON.stringify(req.body));

    let statement = 'SELECT allowed, disable FROM cert_'+req.body.id+' WHERE deviceID="'+req.body.deviceID+'";';

    PoolGetConnection(statement)
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function (rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return ResponseComplete(res, rows);
        }, function (err) {
            console.log("err 1 : " + err);
            res.json({success: false, msg: err});
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: err});
        });

});

router.post('/AddCert04', (req, res, next) => {

    console.log(JSON.stringify(req.body));

    let statement = "SELECT * FROM cert_"+req.body.user.id+" WHERE deviceID='"+req.body.deviceId+"';";

    console.log(statement);

    PoolGetConnection(statement)
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function (rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            if (JSON.stringify(rows) === '[]') {
                console.log('rows = []');
                return Complete(res);
            } else {
            //else if (rows[0].deviceID == req.body.deviceId) {
                console.log('Additional Cert Validate False');
                res.json({success: false, msg: 'Additional Cert Validate False'});
            }
        }, function (err) {
            console.log("err 1 : " + err);
            res.json({success: false, msg: err});
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: err});
        });
});

router.post('/AddCert00', (req, res, next) => {


    let certinfo;
    let statement01 = "SELECT cert FROM cert_"+req.body.user.id+" WHERE masterCert=1;";

    //여기서 caCert를 masterCert로 바꿔야 함. 그전에 DB에서 Master=1인 인증서를 찾아와야 함

    PoolGetConnection(statement01)
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {

            certinfo = {
                publicKey : req.body.publicKey,
                masterCert: rows[0].cert,
                user : req.body.user,
                deviceID : req.body.deviceId
            };

            return addAdditionalTempCertQuery(certinfo)
        })
        .then( function(query) {
            console.log("AddCertTemp query : " + query);
            return PoolGetConnection(query);
        })
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return AdditionalCertComplete(res, certinfo);
        }, function(err) {
            console.log("err 1 : "+err);
            res.json({success: false, msg : err });
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg : err });
        });
});

router.post('/AddCert01', (req, res, next) => {

    console.log(JSON.stringify(req.body));

    let CertNumber;

    FindCertNumberQuery(req.body.user.id, req.body.deviceID)
        .then(function (query) {
            //console.log("masterCert query : " + query);
            return PoolGetConnection(query);
        })
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function (rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return ResponseComplete(res, rows);
        }, function (err) {
            console.log("err 1 : " + err);
            res.json({success: false, msg: err});
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: err});
        });
});

router.post('/AddCert03', (req, res, next) => {

    console.log(JSON.stringify(req.body));

    let statement = 'UPDATE cert_'+req.body.user.id+' SET cert="'+req.body.cert+'", allowed='+1+', disable='+0+' WHERE deviceID="'+req.body.deviceID+'";';

    console.log(statement);

    PoolGetConnection(statement)
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function (rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return ResponseComplete(res, rows);
        }, function (err) {
            console.log("err 1 : " + err);
            res.json({success: false, msg: err});
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: err});
        });
});

router.post('/AddCert02', (req, res, next) => {

    console.log(JSON.stringify(req.body));
    let certinfo;

    let highestCertNumber;
    var cert;
    var userAttrs;
    var caAttrs;
    var masterAttrs;
    FindCertNumberHighestQuery(req.body.user.id)
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

            cert = pki.createCertificate();
            cert.publicKey = pki.publicKeyFromPem(req.body.publicKey);
            cert.serialNumber = highestCertNumber;
            cert.validity.notBefore = new Date();
            cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 5);

            console.log('cert serial : '+cert.serialNumber);

            userAttrs = [
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
                    value: req.body.deviceId
                }
            ];
            cert.setSubject(userAttrs);

            let statement01 = "SELECT cert FROM cert_"+req.body.user.id+" WHERE masterCert=1;";

            //여기서 caCert를 masterCert로 바꿔야 함. 그전에 DB에서 Master=1인 인증서를 찾아와야 함

            return PoolGetConnection(statement01);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            //console.log('rows 01 : ' + JSON.stringify(rows));

            const masterCert = pki.certificateFromPem(rows[0].cert);

            masterAttrs = [
                {
                    name: 'commonName',
                    value: masterCert.subject.getField('CN').value
                }, {
                    name: 'countryName',
                    value: masterCert.subject.getField('C').value
                }, {
                    name: 'organizationName',
                    value: masterCert.subject.getField('O').value
                }, {
                    shortName: 'OU',
                    value: masterCert.subject.getField('OU').value
                }
            ];
            cert.setIssuer(masterAttrs);

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

            console.log('add cert : '+JSON.stringify(cert));

            //여기 이후로는 마스터 인증서가 승인한 후에 진행되어야 하는 부분
            //서버로 안오고 클라이언트 측에서 마스터 인증서 개인키로 서명해야 함

            //cert.sign(caPrivateKey);

            certinfo = {
                Acert : cert,
                masterCert: rows[0].cert,
                user : req.body.user,
                deviceID : req.body.deviceId
            };

            console.log('add certinfo : '+JSON.stringify(certinfo));

            return addAdditionalTempCertQuery(certinfo);
        }, function(err) {
            console.log("err 1 : "+err);
        })
        .then( function(query) {
            console.log("AddCertTemp query : " + query);
            return PoolGetConnection(query);
        })
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return AdditionalCertComplete(res, certinfo);
        }, function(err) {
            console.log("err 1 : "+err);
            res.json({success: false, msg : err });
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg : err });
        });

    /*
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
     */

});

function AdditionalCertComplete(res, certinfo) {
    return new Promise( function () {
        console.log('성공 : '+ JSON.stringify(certinfo));
        res.json({
            success: true,
            Acert : certinfo.publicKey,
            masterCert : certinfo.masterCert
        });
    });
}

router.post('/CheckMasterCert', (req, res, next) => {
    let certpem = req.body.cert;
    let user = req.body.user;

    console.log('certpem : '+certpem);

    const cert =  pki.certificateFromPem(certpem);
    const mastervalue = cert.subject.attributes[3].value;
    const serial = cert.serialNumber;

    //console.log('cert : '+JSON.stringify(cert));
    console.log('Master : '+JSON.stringify(mastervalue));
    console.log('serialNumber : '+serial);

    if (mastervalue == 'Master') {

        //let statement = 'SELECT masterCert FROM "cert_'+user.id+'" WHERE cert="'+certpem+'";';

        let statement = "SELECT * FROM cert_" + user.id + " WHERE certnumber=" + serial + ";";

        PoolGetConnection(statement)
            .then(function (connectionQuery) {
                return ExecuteQuery(connectionQuery);
            })
            .then(function (rows) {
                console.log("rows : " + JSON.stringify(rows));

                if (rows[0].cert == certpem) {

                    statement = "SELECT cert, allowed, disable, deviceID FROM cert_" + user.id + " WHERE masterCert=0;";

                    return PoolGetConnection(statement);
                } else {
                    res.json({success: false, msg: 'Failed to Check Master Cert'});
                }

            })
            .then(function (connectionQuery) {
                return ExecuteQuery(connectionQuery);
            })
            .then(function (rows) {
                console.log("rows2 : " + JSON.stringify(rows));
                return ResponseComplete(res, rows);
            })
            .catch(function (err) {
                console.log(err);
                res.json({success: false, msg: 'Failed to Check Master Cert'});
            })

    } else {
        console.log('Failed to Check Master Cert');
        res.json({success: false, msg: 'Failed to Check Master Cert'});
    }
});

router.post('/CertDisable', (req, res, next) => {

    var user = req.body.user;
    var cert = req.body.cert;

    let statement = 'UPDATE cert_'+user.id+' SET disable='+1+' WHERE deviceID="'+cert.deviceID+'";';

    PoolGetConnection(statement)
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return Complete(res);
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: 'Failed to CertDisable'});
        })
});

router.post('/CertAble', (req, res, next) => {

    var user = req.body.user;
    var cert = req.body.cert;

    let statement = 'UPDATE cert_'+user.id+' SET disable='+0+' WHERE deviceID="'+cert.deviceID+'";';

    PoolGetConnection(statement)
        .then(function (connectionQuery) {
            return ExecuteQuery(connectionQuery);
        })
        .then(function(rows) {
            console.log("This Solutions is : " + JSON.stringify(rows));
            return Complete(res);
        })
        .catch(function (err) {
            console.log(err);
            res.json({success: false, msg: 'Failed to CertAble'});
        })
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

function ResponseComplete(res, rows) {
    return new Promise( function () {
        console.log('성공');
        console.log('rows response : '+JSON.stringify(rows));
        res.json({
            success: true,
            result : rows,
            msg: 'Success'
        });
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