var forge = require('node-forge');
var fs = require('fs');
var pki = forge.pki;

//키생성
var rsa = forge.pki.rsa;
var keypair = rsa.generateKeyPair(2048);
var publicKey = keypair.publicKey;
var privateKey = keypair.privateKey;

//포맷변환 (privateKey - PEM)
var pem1 = pki.privateKeyToPem(privateKey);
var privateKey2 = pki.privateKeyFromPem(pem1);

//포맷변환 (privateKey - ASN.1)
var rsaPrivateKey = pki.privateKeyToAsn1(privateKey);
var privateKey3 = pki.privateKeyFromAsn1(rsaPrivateKey);

// wrap an RSAPrivateKey ASN.1 object in a PKCS#8 ASN.1 PrivateKeyInfo
// 개인키를 RSA ASN.1 오브젝트 형식의 정보????
var privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
// convert a PKCS#8 ASN.1 PrivateKeyInfo to PEM
var pem2 = pki.privateKeyInfoToPem(privateKeyInfo);

// encrypts a PrivateKeyInfo using a custom password and
// outputs an EncryptedPrivateKeyInfo
// 개인키정보의 암호화 저장 (PrivateKeyInfo를 aes256으로 암호화)
var encryptedPrivateKeyInfo = pki.encryptPrivateKeyInfo(
    privateKeyInfo, 'myCustomPasswordHere', {
        algorithm: 'aes256', // 'aes128', 'aes192', 'aes256', '3des'
    });

// decrypts an ASN.1 EncryptedPrivateKeyInfo that was encrypted
// with a custom password
// 개인키 정보를 복호화
var privateKeyInfo2 = pki.decryptPrivateKeyInfo(
    encryptedPrivateKeyInfo, 'myCustomPasswordHere');

// converts an EncryptedPrivateKeyInfo to PEM
var pem3 = pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo);
fs.writeFileSync("testpem1.pem", pki.privateKeyToPem(privateKey));
fs.writeFileSync("testpem2.pem", pki.privateKeyInfoToPem(privateKeyInfo));
fs.writeFileSync("testpem3.pem", pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo));

// converts a PEM-encoded EncryptedPrivateKeyInfo to ASN.1 format
var encryptedPrivateKeyInfo2 = pki.encryptedPrivateKeyFromPem(pem3);

// wraps and encrypts a Forge private key and outputs it in PEM format
var pem4 = pki.encryptRsaPrivateKey(privateKey, 'password');

// encrypts a Forge private key and outputs it in PEM format using OpenSSL's
// proprietary legacy format + encapsulated PEM headers (DEK-Info)
//var pem5 = pki.encryptRsaPrivateKey(privateKey, 'password', {legacy: true});

// decrypts a PEM-formatted, encrypted private key
var privateKey4 = pki.decryptRsaPrivateKey(pem4, 'password');
//var privateKey5 = pki.decryptRsaPrivateKey(pem5, 'password');

// sets an RSA public key from a private key
var publicKey2 = pki.setRsaPublicKey(privateKey4.n, privateKey4.e);

console.log('초기 개인키 - 공개키');
console.log('public key : '+forge.util.bytesToHex(publicKey));
console.log('private key : '+forge.util.bytesToHex(privateKey));
console.log('-------------------------');

console.log('개인키를 pem 형식으로 변환 // 포맷변환 (privateKey - PEM)');
console.log('pem1 : '+pem1);
console.log('private key 2 : '+JSON.stringify(privateKey2));
console.log('-------------------------');

console.log('포맷변환 (privateKey - ASN.1)');
console.log('RSA private key : '+JSON.stringify(rsaPrivateKey));
console.log('private Key 3 : '+JSON.stringify(privateKey3));
console.log('-------------------------');

console.log('포맷변환 (PKCS#8 ASN.1 PrivateKeyInfo - PEM)');
console.log('private Key Info : '+JSON.stringify(privateKeyInfo));
console.log('pem2 : '+pem2);
console.log('-------------------------');

console.log('개인키정보의 암호화 저장 (PrivateKeyInfo를 aes256으로 암호화)');
console.log('encrypted Private Key Info : '+JSON.stringify(encryptedPrivateKeyInfo));
console.log('pem3 : '+pem3);
console.log('encrypted Private Key Info 2 : '+JSON.stringify(encryptedPrivateKeyInfo2));
console.log('-------------------------');

console.log('개인키 정보를 복호화');
console.log('private Key Info 2 : '+JSON.stringify(privateKeyInfo2));
console.log('-------------------------');

console.log('암호화된 개인키 정보를 pem 형식으로 변환');
console.log('pem4 : '+pem4);
console.log('private Key 4 : '+JSON.stringify(privateKey4));
console.log('-------------------------');

console.log('암호화된 개인키 정보를 pem legacy 형식으로 변환');
//console.log('pem5 : '+pem5);
//console.log('private Key 5 : '+privateKey5);
console.log('-------------------------');

console.log('개인키로부터 공개키 추출');
console.log('public key 2 : '+JSON.stringify(publicKey2));
console.log('-------------------------');
