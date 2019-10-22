import Vue from 'vue';
import Vuex from 'vuex';
import * as forge from 'node-forge';
var pki = forge.pki;
//import fs from 'browserify-fs';
import * as fs from 'browserify-fs';
//import fs from 'fs';
//var fs = require('fs');
//var fs = require('browserify-fs');
import axios from 'axios';
import main from './main';

Vue.use(Vuex);

//const resourceHost = 'http://localhost:3000';
const resourceHost = '';

export default new Vuex.Store({
    state: {
        sToken: null,
        pToken: null,
        paid : null,
        CertType : null,
    },
    mutations: {
        GET_TOKENS : function(state, payload) {
            state.sToken = localStorage.getItem('sToken');
            state.pToken = localStorage.getItem('pToken');
        },
        GET_CERTTYPE : function(state, payload) {
            var M = localStorage.getItem(payload.id+'.cert');
            var A = localStorage.getItem(payload.id+'.Acert');
            if (M != null) {
                state.CertType = 'm';
            }
            if (A != null) {
                state.CertType = 'a';
            }
        },
        LOGIN : function (state, payload) {
            state.sToken = payload.data.stoken;
            state.pToken = payload.data.ptoken;
            localStorage.setItem('pToken', payload.data.ptoken);
            localStorage.setItem('sToken', payload.data.stoken);
        },
        LOGOUT : function (state) {
            state.sToken = null;
            state.pToken = null;
            localStorage.removeItem('sToken');
            localStorage.removeItem('pToken');
        }
    },
    actions: {
        LOGIN : function (context, payload) {
            return axios.post( resourceHost+'/users/authenticate', payload);
            //return axios.post( '/users/authenticate', payload);
        },
        LOGOUT : function (context) {
            context.commit('LOGOUT');
        },
        REGISTER : function (context, payload) {
            return axios.post( resourceHost+payload.path, payload.user);
            //return axios.post( payload.path, payload.user);
        },
        GetProfile : function (context) {
            let currTime = new Date().getTime();
            let pt = localStorage.getItem('pToken');
            let st = localStorage.getItem('sToken');

            var md = forge.md.sha256.create();
            md.update(currTime + st);
            let auth = md.digest().toHex();

            return axios.get(
                resourceHost+'/users/profile',
                //'/users/profile',
                { headers: {
                        "Authorization" : pt,
                        "Ctime" : currTime,
                        "Auth" : auth,
                        "Content-Type" : 'application/json'
                    }
                });
        },
        PAY : function (context, payload) {
            return axios.post( resourceHost+'/Pay/procpay', payload);
            //return axios.post( '/Pay/procpay', payload);
        },
        NewProduct : function (context, payload) {
            return axios.post(resourceHost+'/stores/newStore', payload);
            //return axios.post('/stores/newStore', payload);
        },
        GetProduct : function (context) {
            return axios.post(resourceHost+'/stores/Product');
            //return axios.post('/stores/Product');
        },
        GetStore : function (context) {
            return axios.post(resourceHost+'/stores/Store');
            //return axios.post('/stores/Store');
        },
        FoundEnt : function (context, payload) {
            return axios.post(resourceHost+'/stores/FoundEnt', payload);
            //return axios.post('/stores/FoundEnt', payload);
        },
        FindCategory : function (context, payload) {
            return axios.post(resourceHost+'/stores/FindCategory', payload);
            //return axios.post('/stores/FindCategory', payload);
        },
        MyGetProduct : function (context, payload) {
            return axios.post(resourceHost+'/stores/MyProduct', payload);
        },
        MyGetProduct2 : function (context, payload) {
            return axios.post(resourceHost+'/stores/MyProduct2', payload);
        },
        MyFindCategory : function (context, payload) {
            return axios.post(resourceHost+'/stores/MyFindCategory', payload);
        },
        ChangePass: function (context, payload) {
            return axios.post(resourceHost+'/users/ChangePass', payload);
        },
        FindUsername: function (context, payload) {
            return axios.post(resourceHost+'/users/FindUsername', payload);
        },
        GetOrder : function (context, payload) {
            let auth = localStorage.getItem("pToken");
            return axios.post(
                resourceHost+'/Pay/GetOrder',
                payload,
                {headers : {
                        "Authorization" : auth
                    }});
            //return axios.post( '/Pay/GetOrder', payload);
        },
        GetOrder_2 : function (context, payload) {
            let a = (payload.orderno).split('/');
            let order = {
                order_no: a[0],
                time : a[1]
            };
            return axios.post( resourceHost+'/Pay/GetOrder_2', order);
            //return axios.post( '/Pay/GetOrder', payload);
        },
        GetOrder_3 : function (context, payload) { //사용자의 주문 조회
            let number = {
                number : payload.number
            };
            return axios.post( resourceHost+'/Pay/GetOrder_3', number);
            //return axios.post( '/Pay/GetOrder', payload);
        },
        GetOrder_4 : function (context, payload) { //판매자의 판매상품 주문 조회
            return axios.post( resourceHost+'/Pay/GetOrder_4', payload);
            //return axios.post( '/Pay/GetOrder', payload);
        },
        GetProductOder : function (context, payload) {
            console.log('product payload'+payload);
            return axios.post( resourceHost+'/stores/GetProductOder', payload);
            //return axios.post( '/stores/GetProductDetail', payload);
        },
        GetCart : function (context, payload) {
            console.log(JSON.stringify(payload));
            return axios.post(resourceHost+'/stores/GetCart', payload);
        },
        GetProductDetail : function (context, payload) {
            return axios.post( resourceHost+'/stores/GetProductDetail', payload);
            //return axios.post( '/stores/GetProductDetail', payload);
        },
        GetProductDetail2 : function (context, payload) {
            return axios.post( resourceHost+'/stores/GetProductDetail2', payload);
            //return axios.post( '/stores/GetProductDetail', payload);
        },
        GetProductDetail3 : function (context, payload) {
            return axios.post( resourceHost+'/stores/GetProductDetail3', payload);
            //return axios.post( '/stores/GetProductDetail', payload);
        },
        GetProductDetail4 : function (context, payload) {
            return axios.post( resourceHost+'/stores/GetProductDetail4', payload);
            //return axios.post( '/stores/GetProductDetail', payload);
        },
        addBasket : function (context, payload) {
            return axios.post( resourceHost+'/users/addBasket', payload);
            //return axios.post( '/users/addBasket', payload);
        },
        newOrder : function (context, payload) {
            return axios.post( resourceHost+'/Pay/newOrder', payload);
            //return axios.post( '/Pay/newOrder', payload);
        },
        certRequest : function(context, payload) {

            // 1. 공개키, 개인키 생성
            var keypair = pki.rsa.generateKeyPair(2048);
            var publicKey = keypair.publicKey;
            var privateKey = keypair.privateKey;
            var privateKeyPem = pki.privateKeyToPem(privateKey);
            var publicKeyPem = pki.publicKeyToPem(publicKey);

            console.log('public key : '+JSON.stringify(publicKey));
            console.log('private Key : '+JSON.stringify(privateKey));
            console.log('public key PEM : '+JSON.stringify(publicKeyPem));
            console.log('private Key PEM : '+JSON.stringify(privateKeyPem));

            // 2. 개인키 포맷변환 Asn1
            var rsaPrivateKey = pki.privateKeyToAsn1(privateKey);
            console.log('rsaPrivateKey : '+JSON.stringify(rsaPrivateKey));

            // 3. 개인키 정보 생성
            // 개인키를 RSA ASN.1 오브젝트 형식으로 변환
            var privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
            console.log('privateKeyInfo : '+JSON.stringify(privateKeyInfo));

            // 4. 개인키 정보를 암호화(비밀번호 사용)
            var encryptedPrivateKeyInfo = pki.encryptPrivateKeyInfo(
                privateKeyInfo, payload.pa, {
                    algorithm: 'aes256', // 'aes128', 'aes192', 'aes256', '3des'
                });
            console.log('encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));

            // 5. 암호화된 개인키를 pem 형식으로 변환
            var finalpem =  pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo);
            console.log('encryptedPrivateKeyInfo PEM : '+finalpem);

            /*
            fs.mkdir('/home', function() {
                fs.writeFile('/home/hello-world.txt', 'Hello world!\n', function() {
                    fs.readFile('/home/hello-world.txt', 'utf-8', function(err, data) {
                        console.log(data);
                    });
                });
            });

            var filename = './'+payload.user.id+'pem.txt';

            fs.writeFile(filename, pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo), function (err) {
                if(err)console.log(err);
                else {
                    console.log("key save success");
                    fs.readFile(filename, 'utf-8', function(err, ma11) {
                        if(err)console.log(err);
                        else console.log( filename+' : '+ma11);
                    });
                }
            });
            */

            localStorage.setItem(payload.user.id+'.pem', finalpem);

            const req = {
                user : payload.user,
                publicKey: publicKeyPem
            };

            return axios.post( resourceHost+'/Cert/newCert', req);
            //return axios.post( '/Cert/newCert', req);
        },
        AddCertRequest : function(context, payload) {

            // 1. 공개키, 개인키 생성
            var keypair = pki.rsa.generateKeyPair(2048);
            var publicKey = keypair.publicKey;
            var privateKey = keypair.privateKey;
            var privateKeyPem = pki.privateKeyToPem(privateKey);
            var publicKeyPem = pki.publicKeyToPem(publicKey);

            console.log('Add public key : '+JSON.stringify(publicKey));
            console.log('Add private Key : '+JSON.stringify(privateKey));
            console.log('Add public key PEM : '+JSON.stringify(publicKeyPem));
            console.log('Add private Key PEM : '+JSON.stringify(privateKeyPem));

            // 2. 개인키 포맷변환 Asn1
            var rsaPrivateKey = pki.privateKeyToAsn1(privateKey);
            console.log('Add rsaPrivateKey : '+JSON.stringify(rsaPrivateKey));

            // 3. 개인키 정보 생성
            // 개인키를 RSA ASN.1 오브젝트 형식으로 변환
            var privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
            console.log('Add privateKeyInfo : '+JSON.stringify(privateKeyInfo));

            // 4. 개인키 정보를 암호화(비밀번호 사용)
            var encryptedPrivateKeyInfo = pki.encryptPrivateKeyInfo(
                privateKeyInfo, payload.pa, {
                    algorithm: 'aes256', // 'aes128', 'aes192', 'aes256', '3des'
                });
            console.log('Add encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));

            // 5. 암호화된 개인키를 pem 형식으로 변환
            var finalpem =  pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo);
            console.log('Add encryptedPrivateKeyInfo PEM : '+finalpem);

            localStorage.setItem(payload.user.id+'.pem', finalpem);

            const req = {
                user : payload.user,
                deviceId : payload.deviceId,
                publicKey: publicKeyPem
            };
            console.log("req : "+JSON.stringify(req));

            return axios.post( resourceHost+'/Cert/AddCert00', req);
            //return axios.post( '/Cert/AddCert', req);
        },
        AddCertAllow : function(context, payload) {

            console.log('cert payload : '+JSON.stringify(payload));

            function pad(n, width) {
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
            }

            let cert;
            let userAttrs;
            let masterAttrs;
            let certinfo;

            const master = localStorage.getItem(payload.user.id+'.cert');
            const masterCert = pki.certificateFromPem(master);
            const masterPem = localStorage.getItem(payload.user.id+'.pem');

            // 1. 공개키 받음
            var publicKey =  pki.publicKeyFromPem(payload.cert.cert);
            console.log('publickKey : '+JSON.stringify(publicKey));

            let R01 = {
                user : payload.user,
                deviceID: payload.cert.deviceID
            };

            return axios.post(resourceHost+'/Cert/AddCert01', R01)
                .then( response => {
                    console.log('vuex response : '+JSON.stringify(response));

                    let CertNumber = response.data.result[0].certnumber;
                    console.log('CertNumber 1 : '+CertNumber);

                    CertNumber = pad(CertNumber, 2);
                    console.log('CertNumber 2 : '+CertNumber);

                    cert = pki.createCertificate();
                    cert.publicKey = publicKey;
                    cert.serialNumber = CertNumber;
                    cert.validity.notBefore = new Date();
                    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 3);

                    console.log('cert serial : '+cert.serialNumber);

                    userAttrs = [
                        {
                            name: 'commonName',
                            value: payload.user.number
                        }, {
                            name: 'countryName',
                            value: 'kr'
                        }, {
                            name: 'organizationName',
                            value: 'Coconut'
                        }, {
                            shortName: 'OU',
                            value: payload.cert.deviceID
                        }
                    ];
                    cert.setSubject(userAttrs);

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
                        }, {
                            shortName: 'ST',
                            value: 'Gyeonggi-do'
                        }, {
                            name: 'localityName',
                            value: 'Goyang-si'
                        },
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

                    // 마스터 인증서의 개인키 복호화
                    var encryptedPrivateKeyInfo = pki.encryptedPrivateKeyFromPem(masterPem);
                    console.log('encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));

                    var privateKeyInfo = pki.decryptPrivateKeyInfo(
                        encryptedPrivateKeyInfo, payload.pa);
                    console.log('privateKeyInfo : '+JSON.stringify(privateKeyInfo));

                    var privateKey = pki.privateKeyFromAsn1(privateKeyInfo);
                    console.log('privateKey : '+JSON.stringify(privateKey));


                    // 마스터 인증서 개인키로 추가 인증서 서명
                    cert.sign(privateKey);

                    certinfo = {
                        cert : pki.certificateToPem(cert),
                        deviceID : payload.cert.deviceID,
                        masterCert: master,
                        user : payload.user
                    };

                    console.log('cert info : '+JSON.stringify(certinfo));
                    return axios.post(resourceHost+'/Cert/AddCert03', certinfo);
                })
                .finally( (response) => {
                    console.log('final response : '+JSON.stringify(response));

                    return response
                })
                .catch( err => {
                    console.log('vuex err : ' + err);
                })
        },
        AddCertDisable : function(context, payload) {
            return axios.post( resourceHost+'/Cert/CertDisable', payload);
        },
        AddCertAble : function(context, payload) {
            return axios.post( resourceHost+'/Cert/CertAble', payload);
        },
        AddCert04 : function(context, payload) {
            return axios.post( resourceHost+'/Cert/AddCert04', payload);
        },
        AddCertAllowCheck : function(context, payload) {
            let device = localStorage.getItem(payload.id+'.deviceId');

            var deviceR = {
                deviceID : device,
                id : payload.id
            };

            return axios.post( resourceHost+'/Cert/AddCertAllowCheck', deviceR);
        },
        CertCheck : function(context, payload) {
            console.log('CertType : '+context.state.CertType);
            if (context.state.CertType === 'm') {
                var re01 = {
                    date : {
                        success : true
                    }
                };
                return re01;
            } else if (context.state.CertType === 'a') {
                const deviceID = localStorage.getItem(payload.id+'.deviceId');

                let check = {
                    id : payload.id,
                    deviceID : deviceID
                };

                return axios.post( resourceHost+'/Cert/CertCheck', check);

            } else {
                var re02 = {
                    date : {
                        success : false
                    }
                };
                return re02;
            }
        },
        CertValidate : function(context, payload) {
            console.log(payload.id+'.pem');
            var pem = localStorage.getItem(payload.id+'.pem');
            console.log('pem : '+pem);
            var encryptedPrivateKeyInfo = pki.encryptedPrivateKeyFromPem(pem);
            console.log('encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));
            var privateKeyInfo = pki.decryptPrivateKeyInfo(
                encryptedPrivateKeyInfo, payload.pa);
            console.log('privateKeyInfo : '+JSON.stringify(privateKeyInfo));
            var privateKey = pki.privateKeyFromAsn1(privateKeyInfo);
            console.log('privateKey : '+JSON.stringify(privateKey));

            var currentTime = new Date().getTime();

            // sign data using RSASSA-PSS where PSS uses a SHA-1 hash, a SHA-1 based
            // masking function MGF1, and a 20 byte salt
            var md1 = forge.md.sha1.create();
            md1.update(payload.id, 'utf8');
            md1.update(currentTime, 'utf8');
            var pss1 = forge.pss.create({
                md: forge.md.sha1.create(),
                mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                saltLength: 20
                // optionally pass 'prng' with a custom PRNG implementation
                // optionalls pass 'salt' with a forge.util.ByteBuffer w/custom salt
            });
            var signature1 = privateKey.sign(md1, pss1);
            var signatureHex1 = forge.util.bytesToHex(signature1);
            console.log('signature 1 : '+signature1);
            console.log('signature Hex 1 : '+signatureHex1);

            const certPem = localStorage.getItem(payload.id+'.cert');
            const cert = pki.certificateFromPem(certPem);
            const publicKey = cert.publicKey;
            // verify RSASSA-PSS signature
            var pss2 = forge.pss.create({
                md: forge.md.sha1.create(),
                mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                saltLength: 20
                // optionally pass 'prng' with a custom PRNG implementation
            });
            var md2 = forge.md.sha1.create();
            md2.update(payload.id, 'utf8');
            md2.update(currentTime, 'utf8');
            var verifySignature =  publicKey.verify(md2.digest().getBytes(), signature1, pss2);
            console.log('Signature Verify : '+verifySignature);

        },
        CheckMasterCert : function(context, payload) {

            var cert = localStorage.getItem(payload.id+'.cert');
            console.log('cert : '+cert);

            var cert01 =  pki.certificateFromPem(cert);
            console.log('cert01 : '+JSON.stringify(cert01));
            console.log('Master : '+JSON.stringify(cert01.subject.attributes[3].value));
            console.log('serialNumber : '+cert01.serialNumber);

            var certR = {
                cert : cert,
                user : payload
            };

            return axios.post(resourceHost+'/Cert/CheckMasterCert', certR);
        },
        storeMCert : function(context, payload) {
            localStorage.setItem(payload.id+'.cert', payload.response.Mcert);
            localStorage.setItem('caCert', payload.response.caCert);
        },
        storeACert : function(context, payload) {
            localStorage.setItem(payload.id+'.Acert', payload.response.Acert);
            localStorage.setItem(payload.id+'.masterCert', payload.response.masterCert);
            localStorage.setItem(payload.id+'.deviceId', payload.deviceId);
        },
        storeACertissue : function(context, payload) {
            localStorage.setItem(payload.user.id+'.Acert', payload.cert);
        },
        deletePem : function(context, payload) {
            localStorage.removeItem(payload.user.id+'.pem');
        },
        SecondGetOrder : function(context, payload) {

            return axios.post(resourceHost+'/Pay/GetOrder', payload);

            /*
            setInterval(function() {
                axios.post(resourceHost+'/Pay/GetOrder', payload)
                    .then( response => {
                        console.log('second response : '+JSON.stringify(response.data.order[0].paid));
                        if (response.data.order[0].paid == 1) {
                            //console.log('context : '+JSON.stringify(context));
                            context.state.paid = true;
                        } else {
                            //console.log('context : '+JSON.stringify(context));
                            context.state.paid = false;
                        }
                    })
            },2000);

             */

        },
        TradeRequest : function(context, payload) {
            console.log(payload.id+'.pem');
            var pem = localStorage.getItem(payload.id+'.pem');
            console.log('pem : '+pem);
            var encryptedPrivateKeyInfo = pki.encryptedPrivateKeyFromPem(pem);
            console.log('encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));
            var privateKeyInfo = pki.decryptPrivateKeyInfo(
                encryptedPrivateKeyInfo, payload.pa);
            console.log('privateKeyInfo : '+JSON.stringify(privateKeyInfo));
            var privateKey = pki.privateKeyFromAsn1(privateKeyInfo);
            console.log('privateKey : '+JSON.stringify(privateKey));

            var currentTime = new Date().getTime();

            console.log('payload : '+JSON.stringify(payload));
            console.log('currentTime : '+currentTime);

            const sign = {
                id : payload.id,
                unum : payload.unum,
                order : payload.order,
                order_no : payload.order_no,
            };

            // sign data using RSASSA-PSS where PSS uses a SHA-1 hash, a SHA-1 based
            // masking function MGF1, and a 20 byte salt
            var md1 = forge.md.sha1.create();
            md1.update(sign, 'utf8');
            md1.update(currentTime, 'utf8');
            var pss1 = forge.pss.create({
                md: forge.md.sha1.create(),
                mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                saltLength: 20
                // optionally pass 'prng' with a custom PRNG implementation
                // optionalls pass 'salt' with a forge.util.ByteBuffer w/custom salt
            });
            var signature1 = privateKey.sign(md1, pss1);
            var signatureHex1 = forge.util.bytesToHex(signature1);
            console.log('signature 1 : '+signature1);
            console.log('signature Hex 1 : '+signatureHex1);
            //여기까지 서명 생성


            if (context.state.CertType == 'a') {

                const certPem01 = localStorage.getItem(payload.id+'.Acert');

                const TradeA = {
                    Request : {
                        id : payload.id,
                        unum : payload.unum,
                        order : payload.order,
                        order_no : payload.order_no
                    },
                    deviceID : localStorage.getItem(payload.id+'.deviceId'),
                    currentT : currentTime,
                    cert : certPem01,
                    signature : signatureHex1
                };

                console.log('TradeA : '+JSON.stringify(TradeA));

                return axios.post( resourceHost+'/Pay/TradeA', TradeA);

            } else if (context.state.CertType == 'm') {

                const certPem = localStorage.getItem(payload.id+'.cert');

                const Trade = {
                    Request : {
                        id : payload.id,
                        unum : payload.unum,
                        order : payload.order,
                        order_no : payload.order_no
                    },
                    cert : certPem,
                    currentT : currentTime,
                    signature : signatureHex1
                };

                console.log('TradeM : '+JSON.stringify(Trade));

                return axios.post( resourceHost+'/Pay/Trade', Trade);
            }


            /*
            //여기부터 서명 검증
            const certPem = localStorage.getItem(payload.id+'.cert');
            const cert = pki.certificateFromPem(certPem);
            const publicKey = cert.publicKey;
            // verify RSASSA-PSS signature
            var pss2 = forge.pss.create({
                md: forge.md.sha1.create(),
                mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                saltLength: 20
                // optionally pass 'prng' with a custom PRNG implementation
            });
            var md2 = forge.md.sha1.create();
            md2.update(payload, 'utf8');
            md2.update(currentTime, 'utf8');
            var verifySignature =  publicKey.verify(md2.digest().getBytes(), signature1, pss2);
            console.log('Signature Verify : '+verifySignature);
             */
        },
        ReceiptRequest : function(context, payload) {
            console.log(payload.user.id+'.pem');
            var pem = localStorage.getItem(payload.user.id+'.pem');
            console.log('pem : '+pem);
            var encryptedPrivateKeyInfo = pki.encryptedPrivateKeyFromPem(pem);
            console.log('encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));
            var privateKeyInfo = pki.decryptPrivateKeyInfo(
                encryptedPrivateKeyInfo, payload.pa);
            console.log('privateKeyInfo : '+JSON.stringify(privateKeyInfo));
            var privateKey = pki.privateKeyFromAsn1(privateKeyInfo);
            console.log('privateKey : '+JSON.stringify(privateKey));

            var currentTime = new Date().getTime();

            console.log('payload : '+JSON.stringify(payload));
            console.log('currentTime : '+currentTime);

            const sign = {
                user : payload.user,
                order : payload.order,
                product : payload.product,
                pprice : payload.pprice,
            };

            // sign data using RSASSA-PSS where PSS uses a SHA-1 hash, a SHA-1 based
            // masking function MGF1, and a 20 byte salt
            var md1 = forge.md.sha1.create();
            md1.update(sign, 'utf8');
            //md1.update(currentTime, 'utf8');
            var pss1 = forge.pss.create({
                md: forge.md.sha1.create(),
                mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                saltLength: 20
                // optionally pass 'prng' with a custom PRNG implementation
                // optionalls pass 'salt' with a forge.util.ByteBuffer w/custom salt
            });
            var signature1 = privateKey.sign(md1, pss1);
            var signatureHex1 = forge.util.bytesToHex(signature1);
            console.log('signature 1 : '+signature1);
            console.log('signature Hex 1 : '+signatureHex1);
            //여기까지 서명 생성

            const certPem = localStorage.getItem(payload.user.id+'.cert');

            const Receipt = {
                Request : {
                    user : payload.user,
                    order : payload.order,
                    product : payload.product,
                    pprice : payload.pprice,
                },
                cert : certPem,
                currentT : currentTime,
                signature : signatureHex1
            };

            return axios.post( resourceHost+'/Pay/Receipt', Receipt);
            /*
            //여기부터 서명 검증
            const certPem = localStorage.getItem(payload.id+'.cert');
            const cert = pki.certificateFromPem(certPem);
            const publicKey = cert.publicKey;
            // verify RSASSA-PSS signature
            var pss2 = forge.pss.create({
                md: forge.md.sha1.create(),
                mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                saltLength: 20
                // optionally pass 'prng' with a custom PRNG implementation
            });
            var md2 = forge.md.sha1.create();
            md2.update(payload, 'utf8');
            md2.update(currentTime, 'utf8');
            var verifySignature =  publicKey.verify(md2.digest().getBytes(), signature1, pss2);
            console.log('Signature Verify : '+verifySignature);
             */
        },
        ReceiptValidateRequest : function(context, payload) {

            const sign = {
                user : payload.user,
                order : payload.order,
                product : payload.product,
                pprice : payload.pprice,
            };
            let res;

            /*
            const Receipt = {
                Request : {
                    user : payload.user,
                    order : payload.order,
                    product : payload.product,
                    pprice : payload.pprice,
                },
                cert : certPem,
                currentT : currentTime,
                signature : signatureHex1
            };
             */

            axios.post( resourceHost+'/Pay/ReceiptValidate', sign)
                .then( response => {
                    //console.log('response : '+JSON.stringify(response));

                    let certPem = response.data.Cert;
                    //console.log('certPem : '+JSON.stringify(certPem));

                    //여기부터 서명 검증
                    //const certPem = localStorage.getItem(payload.id+'.cert');

                    for (var i=0; i<certPem.length; i++){
                        let cert = pki.certificateFromPem(certPem[i].cert);
                        console.log('cert : ' + JSON.stringify(cert));

                        let publicKey = cert.publicKey;
                        console.log('publicKey : ' + JSON.stringify(publicKey));

                        // verify RSASSA-PSS signature
                        var pss2 = forge.pss.create({
                            md: forge.md.sha1.create(),
                            mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
                            saltLength: 20
                            // optionally pass 'prng' with a custom PRNG implementation
                        });

                        var md2 = forge.md.sha1.create();
                        md2.update(sign, 'utf8');

                        var verifySignature =  publicKey.verify(md2.digest().getBytes(), payload.signature[0], pss2);

                        console.log('Signature Verify : '+verifySignature);

                        if (verifySignature === true) {
                            res = {
                                cert : certPem[i].cert,
                                verifySignature : verifySignature
                            };
                            return res;
                        } else {
                            if (i === (certPem.length - 1)) {
                                res = {
                                    verifySignature : false
                                };
                                return res1;
                            }
                        }
                    }

                })
                .catch( err => {
                    res = {
                        verifySignature : err
                    };
                    return res;
                });



        },
    }
})