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
    },
    mutations: {
        GET_TOKENS : function(state, payload) {
            state.sToken = localStorage.getItem('sToken');
            state.pToken = localStorage.getItem('pToken');
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
        MyFindCategory : function (context, payload) {
            return axios.post(resourceHost+'/stores/MyFindCategory', payload);
        },
        ChangePass: function (context, payload) {
            return axios.post(resourceHost+'/users/ChangePass', payload);
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
        GetOrder_Camera : function (context, payload) {
            return axios.post( resourceHost+'/Pay/GetOrder_Camera', payload);
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
        addBasket : function (context, payload) {
            return axios.post( resourceHost+'/users/addBasket', payload);
            //return axios.post( '/users/addBasket', payload);
        },
        newOrder : function (context, payload) {
            return axios.post( resourceHost+'/Pay/newOrder', payload);
            //return axios.post( '/Pay/newOrder', payload);
        },
        certRequest : function(context, payload) {

            var keypair = pki.rsa.generateKeyPair(2048);
            var publicKey = keypair.publicKey;
            var privateKey = keypair.privateKey;
            var privateKeyPem = pki.privateKeyToPem(privateKey);
            var publicKeyPem = pki.publicKeyToPem(publicKey);

            console.log('public key : '+JSON.stringify(publicKey));
            console.log('private Key : '+JSON.stringify(privateKey));
            console.log('public key PEM : '+JSON.stringify(publicKeyPem));
            console.log('private Key PEM : '+JSON.stringify(privateKeyPem));

            //2. 개인키 포맷변환 Asn1
            var rsaPrivateKey = pki.privateKeyToAsn1(privateKey);
            console.log('rsaPrivateKey : '+JSON.stringify(rsaPrivateKey));

            //3. 개인키 정보 생성
            // 개인키를 RSA ASN.1 오브젝트 형식의 정보????
            var privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
            console.log('privateKeyInfo : '+JSON.stringify(privateKeyInfo));

            //4. 개인키 정보를 암호화(비밀번호 사용)
            var encryptedPrivateKeyInfo = pki.encryptPrivateKeyInfo(
                privateKeyInfo, payload.pa, {
                    algorithm: 'aes256', // 'aes128', 'aes192', 'aes256', '3des'
                });
            console.log('encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));

            //5. pem 형식으로 만들기 / pem을 fs 사용해서 파일로 저장
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
        AddCertRequest : function(context, payload) {
            var keypair = pki.rsa.generateKeyPair(2048);
            var publicKey = keypair.publicKey;
            var privateKey = keypair.privateKey;
            var privateKeyPem = pki.privateKeyToPem(privateKey);
            var publicKeyPem = pki.publicKeyToPem(publicKey);

            console.log('Add public key : '+JSON.stringify(publicKey));
            console.log('Add private Key : '+JSON.stringify(privateKey));
            console.log('Add public key PEM : '+JSON.stringify(publicKeyPem));
            console.log('Add private Key PEM : '+JSON.stringify(privateKeyPem));

            var rsaPrivateKey = pki.privateKeyToAsn1(privateKey);
            console.log('Add rsaPrivateKey : '+JSON.stringify(rsaPrivateKey));

            var privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
            console.log('Add privateKeyInfo : '+JSON.stringify(privateKeyInfo));

            var encryptedPrivateKeyInfo = pki.encryptPrivateKeyInfo(
                privateKeyInfo, payload.pa, {
                    algorithm: 'aes256', // 'aes128', 'aes192', 'aes256', '3des'
                });
            console.log('Add encryptedPrivateKeyInfo : '+JSON.stringify(encryptedPrivateKeyInfo));

            var finalpem =  pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo);
            console.log('Add encryptedPrivateKeyInfo PEM : '+finalpem);

            localStorage.setItem(payload.user.id+'.pem', finalpem);

            const req = {
                user : payload.user,
                deviceId : payload.deviceId,
                publicKey: publicKeyPem
            };
            console.log("req : "+JSON.stringify(req));

            return axios.post( resourceHost+'/Cert/AddCert', req);
            //return axios.post( '/Cert/AddCert', req);
        },
        storeMCert : function(context, payload) {
            localStorage.setItem(payload.id+'.cert', payload.response.Mcert);
            localStorage.setItem('caCert', payload.response.caCert);
        },
        storeCert : function(context, payload) {
            localStorage.setItem('cert', payload.cert);
            localStorage.setItem('MCert', payload.MCert);
        },
        deletePem : function(context, payload) {
            localStorage.removeItem(payload.user.id+'.pem');
        }
    }
})