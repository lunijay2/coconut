var forge = require('node-forge');
var fs = require('fs');
var pki = forge.pki;
// 1. CA 인증서 생성
// generate a keypair and create an X.509v3 certificate
var caKeys = pki.rsa.generateKeyPair(2048);
var caCert = pki.createCertificate();
// CA 개인키 파일 저장
console.log(pki.privateKeyToPem(caKeys.privateKey));
fs.writeFileSync("caPrivateKey.pem", pki.privateKeyToPem(caKeys.privateKey));
console.log('CA개인키 저장 - caPrivateKey.pem \n');
caCert.publicKey = caKeys.publicKey;
caCert.serialNumber = '01';
caCert.validity.notBefore = new Date();
caCert.validity.notAfter = new Date();
caCert.validity.notAfter.setFullYear(caCert.validity.notBefore.getFullYear() + 1);
var caAttrs = [{
    //name: 'commonName', // CN
    shortName: 'CN',
    value: 'Coconut'
}, {
    //name: 'countryName', // C
    shortName: 'C',
    value: 'KR'
}, {
    //name: 'stateOrProvinceName', // ST
    shortName: 'ST',
    value: 'Gyeonggi-do'
}, {
    //name: 'localityName', // L
    shortName: 'L',
    value: 'Goyang-si'
}, {
    //name: 'organizationName', // O
    shortName: 'O',
    value: 'Joongbu Univ.'
}, {
    //name: 'organizationalUnitName',
    shortName: 'OU',
    value: 'Dept. of Information Security'
}];
caCert.setSubject(caAttrs);
caCert.setIssuer(caAttrs);

caCert.setExtensions([{
    name: 'subjectAltName',
    altNames: [{
        type: 6, // URI
        value: 'http://coconutpay.herokuapp.com/'
    }]
}]);

// self-sign certificate
caCert.sign(caKeys.privateKey);
console.log('CA 자체서명인증서 생성');
console.log(pki.certificateToPem(caCert));
var verified = caCert.verify(caCert);
console.log('CA인증서 생성 후 검증: ' + verified);
console.log();
// CA 인증서 저장
fs.writeFileSync("caCert.pem", pki.certificateToPem(caCert));
console.log('CA인증서 저장 - caCert.pem');
