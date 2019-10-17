const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config/database');
const passport_policy = require('../config/passport');
const bcrypt = require('bcryptjs');
const forge = require('node-forge');
const fs = require('fs');
const pki = forge.pki;

const caCertPem = fs.readFileSync('caCert.pem', 'utf8');
const caPrivateKeyPem = fs.readFileSync('caPrivateKey.pem', 'utf8');
const caCert = pki.certificateFromPem(caCertPem);
const caPrivateKey = pki.privateKeyFromPem(caPrivateKeyPem);

router.post('/procpay',(req, res, next) => {
    let number = req.body.Payinfo.order_no;
    let jwt = req.body.token;
    let Statement;
    procpay(number, jwt)
});

router.post('/GetOrder',(req, res, next) => {
    let order_no = req.body.orderno;
    console.log('order_number : '+order_no);

    //var order_no = order_no.split('/');
    //console.log('o : '+JSON.stringify(order_no));

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

router.post('/GetOrder_2',(req, res, next) => {

    let order_no = req.body.order_no;
    let t1 = req.body.time;
    console.log('order_number : '+order_no);
    console.log('time1 : '+t1);
    let t2 = new Date().getTime();
    console.log('time2 : '+t2);

    if((t2 - t1) > (1000 * 60 * 5)) {
    //if((t2 - t1) > (1000 * 5)) {
        console.log('유효시간 초과');
        res.json({
            success: false,
            msg : '유효시간 초과'
        });
    } else {
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
    }
});

router.post('/GetOrder_3',(req, res, next) => {
    let number = req.body.number;

    UserOrderFoundQuery(number)
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
            res.json({success: false, msg : err });
        })
});

function UserOrderFoundQuery(number) {
    return new Promise( function (resolve, reject) {
        if(number) {
            let statement = "SELECT * FROM trade_detail WHERE orderer=" + number + " OR buyer=" + number + ";";
            console.log("UserOrderFoundQuery : "+statement);
            resolve(statement);
        } else {
            console.log("UserOrderFoundQuery err : "+err);
            reject(err);
        }
    });
}

router.post('/GetOrder_4',(req, res, next) => {
    let products = req.body.products;

    console.log('aaa : '+products);

    let bbb = [];

    for (let i = 0; i < products.length; i++) {
        let ccc = {
            productcode1 : products[i]+"\/%",
            productcode2 : "%,"+products[i]+"\/%"
        };

        bbb.push(ccc);
        //ccc.productcode1 = "";
        //ccc.productcode2 = "";
    }

    console.log("bbb : " + JSON.stringify(bbb));

    UserOrderFoundQuery2(bbb)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            return Complete( res, rows );
        })
        .catch(err => {
            console.log(err);
            res.json({success: false, msg : err });
        })
});

function UserOrderFoundQuery2(bbb) {
    return new Promise( function (resolve, reject) {
        if(bbb) {

            let statement = new Array;
            for (var i=0; i<bbb.length; i++){
                statement.push("SELECT order_no, product, orderer, buyer, price, paid FROM trade_detail WHERE product LIKE '"+ bbb[i].productcode1 +"' OR product LIKE '"+ bbb[i].productcode2 +"';");
            }
            console.log('statement 2 : '+JSON.stringify(statement));

            //let statement = "SELECT * FROM trade_detail WHERE product LIKE ? OR product LIKE ?;";
            //let statement = "SELECT * FROM trade_detail WHERE product IN('5\/', '7\/', ',5\/', ',7\/';";
            console.log("UserOrderFoundQuery2 : "+statement);
            resolve(statement);
        } else {
            console.log("UserOrderFoundQuery2 err : "+err);
            reject(err);
        }
    });
}


router.post('/newOrder',(req, res, next) => {

    console.log(JSON.stringify(req.body));
    let newOrder = {
        //product: req.body.product[0].product,
        //price: req.body.product[0].price,
        product : '',
        price : 0,
        orderer: req.body.orderer,
        delivery_address: req.body.delivery_address,
        delivery_tel: req.body.delivery_tel
    };

    for(var i=0; i< req.body.product.length; i++ ) {
        if(i==0){
            newOrder.product = req.body.product[i].product;
            newOrder.price = req.body.product[i].price;
        } else {
            newOrder.product = newOrder.product+','+req.body.product[i].product;
            newOrder.price = newOrder.price + req.body.product[i].price;
        }
        console.log('new order product : '+newOrder.product);
        console.log('new order price : '+newOrder.price);
    }

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

router.post('/Trade',(req, res, next) => {
    let signatureHex = req.body.signature;
    let Request = req.body.Request;
    let currentTime1 = req.body.currentT;

    console.log('Request : '+JSON.stringify(Request));

    const cert = pki.certificateFromPem(req.body.cert);
    const signature = forge.util.hexToBytes(signatureHex);
    const publicKey = cert.publicKey;
    const serialNumber = cert.serialNumber;
    const commonCert = cert.subject.getField('CN').value;
    let DbCertPem;

    var pss;
    var md;
    var verify0;
    var verify1;
    var verify2;
    var verify3;
    var verify4;
    var p;
    var p1;
    var p2;
    var p3;
    var p4;
    var p5;

    FindCertQuery(serialNumber, Request.id)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            //console.log(rows);
            DbCertPem = rows[0].cert;
            //console.log("DbCertPem : "+DbCertPem);

            const DbCert = pki.certificateFromPem(DbCertPem);
            const DbPublicKey = DbCert.publicKey;
            const DbCommonCert = DbCert.subject.getField('CN').value;
            //받아온 인증서가 DB 인증서 테이블에 존재 하는지 확인
            //그리고 DB의 인증서와 받아온 인증서가 같은지 확인

            //console.log("Cert : "+JSON.stringify(cert));
            //console.log("DbCert : "+JSON.stringify(DbCert));
            //console.log(JSON.stringify(cert) == JSON.stringify(DbCert));

            if( JSON.stringify(cert) == JSON.stringify(DbCert) ) {
                verify0 = true;
                console.log('Signature Verify0 : '+verify0);

                const currentTime2 = new Date().getTime();
                const diff = currentTime2 - currentTime1;

                // verify RSASSA-PSS signature
                pss = forge.pss.create({
                    md: forge.md.sha1.create(),
                    mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                    saltLength: 20
                    // optionally pass 'prng' with a custom PRNG implementation
                });
                md = forge.md.sha1.create();
                md.update(Request, 'utf8');
                md.update(currentTime1, 'utf8');
                verify1 =  DbPublicKey.verify(md.digest().getBytes(), signature, pss);
                console.log('Signature Verify1 : '+verify1);
                verify2 = caCert.verify(DbCert);
                console.log('Signature Verify2 : '+verify2);

                if(diff < 1000 * 30) { //30초
                    verify3 = true;
                    console.log('Signature Verify3 : '+verify3);
                }
                if ( Request.unum == DbCommonCert ) { //인증서 내부의 CN 필드(유저넘버) 비교
                    verify4 = true;
                    console.log('Signature Verify4 : '+verify4);
                }

                if( verify0==true && verify1==true && verify2==true && verify3==true && verify4==true) {

                    p = Request.order.product;

                    console.log('p : '+p);

                    p1 = p.split(',');

                    /*
                    if(p.length >= 1) {
                        p1 = p.split(',');
                    } else {
                        p1 = p;
                    }
                     */

                    p2 = new Array;
                    p3 = new Array;
                    p4 = new Array;
                    for (var i=0; i<p1.length; i++) {
                        p2.push(p1[i].split('/'));
                        p3.push(p2[i][0]);
                        p4.push(p2[i][1]);
                    }

                    for (var j=0; j<p3.length; j++){
                        //p3[j] *= 1;
                        //p4[j] *= 1;

                        for (var k=0; k<p4.length; k++){
                            //p2[j][k] *= 1;
                        }
                    }
                    console.log('p2 (1) : '+p2);
                    console.log('p2 (2) : '+JSON.stringify(p2));
                    console.log('p3 : '+JSON.stringify(p3)); // 코드
                    console.log('p4 : '+JSON.stringify(p4)); // 수량

                    // 1. 구매한 상품들에서 수량 빼고
                    let statement = new Array;
                    for (var i=0; i<p2.length; i++){
                        statement.push("UPDATE product SET allquantity=allquantity-"+p2[i][1]+" WHERE productcode="+p2[i][0]+";");
                    }
                    console.log('statement : '+JSON.stringify(statement));
                    return PoolGetConnection(statement);
                    // 실패 시 모두 롤백
                } else {
                    console.log("Signature Verify err");
                    return res.json({success:false, msg: 'Signature Verify Err'});
                }

            } else {
                return res.json({success:false, msg: 'Certificate Validate Err'});
            }
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            console.log("rows : "+JSON.stringify(rows));

            let statement = new Array;
            for (var i=0; i<p3.length; i++){
                statement.push("SELECT * FROM product WHERE productcode=" + p3[i] + ";");
            }
            console.log('statement 2 : '+JSON.stringify(statement));
            //return res.json({success:true, msg: '111'});

            return PoolGetConnection(statement);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            // 2. 판매자한테는 돈 넣고
            console.log("rows : "+JSON.stringify(rows));
            //console.log("rows user_number 0 : "+JSON.stringify(rows[0][0].user_number));
            //console.log("rows user_number 1 : "+JSON.stringify(rows[1][0].user_number));

            let statement = new Array;
            console.log("rows.length : "+rows.length);
            for (var i=0; i<rows.length; i++){
                for (var j=0; j<rows.length; j++){
                    console.log("rows["+i+"][0].productcode : "+rows[i][0].productcode);
                    console.log("p3["+j+"] : "+p3[j]);
                    if (rows[i][0].productcode == p3[j]) {
                        statement.push("UPDATE user SET money=money+"+ rows[i][0].price * p4[j] +" WHERE number="+rows[i][0].user_number+";");
                    }
                }
            }
            console.log('statement 3 : '+JSON.stringify(statement));

            return PoolGetConnection(statement);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            // 3. 구매자한테서 돈 빼고
            console.log('rows : '+JSON.stringify(rows));

            let statement = new Array;
            statement.push("UPDATE user SET money=money-"+ Request.order.price +" WHERE id='"+ Request.id +"';");

            console.log('statement 4 : '+JSON.stringify(statement));
            return PoolGetConnection(statement);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            // 4. 주문정보 테이블에 결제 정보 업데이트
            console.log('rows : '+JSON.stringify(rows));

            var time = new Date().getTime();

            let statement = new Array;
            statement.push("UPDATE trade_detail SET purchase_signature='"+ signatureHex +"', paid="+ 1 +", trade_time='"+ time +"', buyer="+Request.unum+" WHERE order_no="+ Request.order_no +";");

            console.log('statement 5 : '+JSON.stringify(statement));

            return PoolGetConnection(statement);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            console.log("rows : "+JSON.stringify(rows));

            let statement = new Array;
            statement.push("SELECT * FROM user WHERE number='"+ Request.order.orderer +"';");
            console.log('statement 6 : '+JSON.stringify(statement));

            return PoolGetConnection(statement);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            // 5. 장바구니에서 삭제
            console.log("rows : "+JSON.stringify(rows));

            let statement = new Array;
            for (var i=0; i<p3.length; i++){
                statement.push("DELETE FROM shoppingcart_"+rows[0][0].id+" WHERE productcode="+ p3[i] +";");
            }
            console.log('statement 7 : '+JSON.stringify(statement));

            return PoolGetConnection(statement);
        })
        .then(connectionQuery => {
            return ExecuteQuery2(connectionQuery);
        })
        .then( rows => {
            console.log("rows : "+JSON.stringify(rows));
            console.log("결제 성공");
            return res.json({success:true, order: Request.order_no });
        })
        .catch( function (err, connection) {
            console.log(err);
            //connection.rollback();
        });



    /*
    TradeQuery()
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
     */
});



function ExecuteQuery2(ConQue) {     // Connection과 쿼리문을 받아와서 실행하는 Promise 함수
    return new Promise( function (resolve, reject) {
        let aaa = new Array;
        console.log("ConQue : "+ConQue.query.length);
        let bbb = ConQue.query.length - 1;
        console.log('bbb : '+bbb);
        for (var i=0; i<(ConQue.query.length); i++) {
            ConQue.connection.query(ConQue.query[i], function(err, rows, fields) {
                if (!err) {
                    console.log("query 실행 결과 : "+ JSON.stringify(rows));
                    aaa.push(rows);
                    console.log("query 실행 중 : " + JSON.stringify(aaa));
                    console.log('i : '+i);
                    if (i === aaa.length ) {
                        console.log("query 실행 끝 : " + JSON.stringify(aaa));
                        resolve(aaa);
                        ConQue.connection.release();
                    }
                } else {
                    console.log("query 실행 err : "+err);
                    reject(err);
                }
            });
        }
    });
}


/* ------------------- 영수증 발급 ------------------- */
router.post('/Receipt',(req, res, next) => {
    let signatureHex = req.body.signature;
    let Request = req.body.Request;
    let currentTime1 = req.body.currentT;

    console.log('Request : '+JSON.stringify(Request));

    const cert = pki.certificateFromPem(req.body.cert);
    const signature = forge.util.hexToBytes(signatureHex);
    const publicKey = cert.publicKey;
    const serialNumber = cert.serialNumber;
    const commonCert = cert.subject.getField('CN').value;
    let DbCertPem;

    var pss;
    var md;
    var verify0;
    var verify1;
    var verify2;
    var verify3;
    var verify4;
    var p;
    var p1;
    var p2;
    var p3;
    var p4;
    var p5;
    let statementParams;

    FindCertQuery(serialNumber, Request.user.id)
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            //console.log(rows);
            DbCertPem = rows[0].cert;
            //console.log("DbCertPem : "+DbCertPem);

            const DbCert = pki.certificateFromPem(DbCertPem);
            const DbPublicKey = DbCert.publicKey;
            const DbCommonCert = DbCert.subject.getField('CN').value;
            //받아온 인증서가 DB 인증서 테이블에 존재 하는지 확인
            //그리고 DB의 인증서와 받아온 인증서가 같은지 확인

            //console.log("Cert : "+JSON.stringify(cert));
            //console.log("DbCert : "+JSON.stringify(DbCert));
            //console.log(JSON.stringify(cert) == JSON.stringify(DbCert));

            if( JSON.stringify(cert) == JSON.stringify(DbCert) ) {
                verify0 = true;
                console.log('Signature Verify0 : ' + verify0);

                const currentTime2 = new Date().getTime();
                const diff = currentTime2 - currentTime1;

                // verify RSASSA-PSS signature
                pss = forge.pss.create({
                    md: forge.md.sha1.create(),
                    mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                    saltLength: 20
                    // optionally pass 'prng' with a custom PRNG implementation
                });
                md = forge.md.sha1.create();
                md.update(Request, 'utf8');
                //md.update(currentTime1, 'utf8');
                verify1 = DbPublicKey.verify(md.digest().getBytes(), signature, pss);
                console.log('Signature Verify1 : ' + verify1);
                verify2 = caCert.verify(DbCert);
                console.log('Signature Verify2 : ' + verify2);

                if (diff < 1000 * 30) { //30초
                    verify3 = true;
                    console.log('Signature Verify3 : ' + verify3);
                }
                if (Request.user.number == DbCommonCert) { //인증서 내부의 CN 필드(유저넘버) 비교
                    verify4 = true;
                    console.log('Signature Verify4 : ' + verify4);
                }

                if (verify0 == true && verify1 == true && verify2 == true && verify3 == true && verify4 == true) {
                    console.log("서명 검증 완료");

                    //여기서 서명값 문자열 만들어서 쿼리 생성 후 실행
                    console.log('Request : '+JSON.stringify(Request));

                    let sig01 = '';
                    let statement = '';

                    if ( Request.order.receipt == null ) { //아직 영수증이 하나도 없으면

                        sig01 = Request.product + '+' + signatureHex;
                        console.log('sig01 : '+sig01);

                        statement = "UPDATE trade_detail SET receipt=? WHERE order_no=?;";

                    } else {    // 먼저 발급된 영수증이 하나라도 있으면

                        //sig01 = Request.order.receipt;
                        //sig01 = sig01 + ',' + Request.product + '+' + signatureHex;
                        sig01 =',' + Request.product + '+' + signatureHex;
                        console.log('sig01 : '+sig01);

                        statement = "UPDATE trade_detail SET receipt=CONCAT(receipt,?) WHERE order_no=?;";
                    }

                    statementParams = [sig01, Request.order.order_no];

                    console.log('statement : '+statement);
                    console.log('statementParams : '+statementParams);

                    return PoolGetConnection(statement);
                    // 실패 시 모두 롤백
                } else {
                    console.log("Signature Verify err");
                    return res.json({success:false, msg: 'Receipt Verify Err'});
                }

            } else {
                return res.json({success:false, msg: 'Receipt Validate Err'});
            }
        })
        .then(connectionQuery => {
            return ExecuteQuery3(connectionQuery, statementParams);
        })
        .then( rows => {
            console.log("rows : "+JSON.stringify(rows));
            console.log("영수증 성공");
            return res.json({success:true, order: Request.order.order_no });
        })
        .catch( function (err, connection) {
            console.log(err);
            //connection.rollback();
        });

    /*
    TradeQuery()
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
     */
});



// ---------------- 영수증 서명 검증 ---------------------------
router.post('/ReceiptValidate',(req, res, next) => {
    let products = req.body.product;
    console.log('products : '+products);

    let p = new Array;
    let p1 = new Array;
    p.push(products.split('-'));
    console.log('p : '+JSON.stringify(p));

    for (var i=0; i<p[0].length; i++) {
        console.log('p[0][i] : '+JSON.stringify(p[0][i]));
        p1.push(p[0][i].split('/'));
    }
    console.log('p1 : '+JSON.stringify(p1));

    FindProductCodeQuery(p1[0][0])
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            console.log('rows1 : '+JSON.stringify(rows));

            return ReceiptValidateQuery(rows[0].seller);
        })
        .then( query => {
            return PoolGetConnection(query);
        })
        .then(connectionQuery => {
            return ExecuteQuery(connectionQuery);
        })
        .then( rows => {
            console.log('rows2 : '+JSON.stringify(rows));

            res.json({
                success: true,
                Cert : rows
            })
        })
        .catch(err => {
            console.log(err);
            res.json({success: false});
        })

    /*
    ReceiptValidateQuery()
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

     */
});

function ReceiptValidateQuery(id) {
    return new Promise( function (resolve, reject) {
        if(id) {
            let statement = "SELECT cert FROM cert_"+ id +";";
            console.log("ReceiptValidateQuery : "+statement);
            resolve(statement);
        } else {
            console.log("ReceiptValidateQuery err : "+err);
            reject(err);
        }
    });
}

function FindProductCodeQuery(productcode) {
    return new Promise( function (resolve) {
        console.log('productcode : '+productcode);
        let statement = "SELECT * FROM product where productcode='"+productcode+"';";
        console.log("CreateFindProductCodeQuery : "+statement);
        resolve(statement);
    });
}

function procpay(number, jwt) {
    return new Promise( function (resolve, reject) {
        let temp = passport_policy(jwt);
        console.log(temp);
    })
}

function TradeQuery(ordernumber) {
    return new Promise( function (resolve, reject) {
        if(ordernumber) {
            let statement = "SELECT * FROM trade_detail WHERE order_no=" + ordernumber + ";";
            console.log("TradeQuery : "+statement);
            resolve(statement);
        } else {
            console.log("TradeQuery err : "+err);
            reject(err);
        }
    });
}

function FindCertQuery(serial, id) {
    return new Promise( function (resolve, reject) {
        if(serial && id) {
            let statement = "SELECT * FROM cert_"+id+" WHERE certnumber=" + serial +";";

            //statement = statement.replace(/\n/g, ""); //행바꿈제거
            // = statement.replace(/\r/g, "");//엔터제거
            console.log("FindCertQuery : "+statement);
            resolve(statement);
        } else {
            console.log("FindCertQuery err : "+err);
            reject(err);
        }
    });
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

function ExecuteQuery3(ConQue, Params) {     // Connection과 쿼리문을 받아와서 실행하는 Promise 함수
    return new Promise( function (resolve, reject) {
        ConQue.connection.query(ConQue.query, Params, function(err, rows, fields) {
            if (!err) {
                console.log("query3 실행 결과 : "+ JSON.stringify(rows));
                resolve(rows);
            } else {
                console.log("query3 실행 err : "+err);
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