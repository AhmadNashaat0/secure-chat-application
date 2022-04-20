import {JSEncrypt} from 'jsencrypt';
import CryptoJS from "crypto-js";

var SECURITY_LEVEL = 2048;

if ((window.navigator.userAgent.indexOf('MSIE') > 0) ||
    (window.navigator.userAgent.indexOf('Trident/7') > 0) ||
    (window.navigator.userAgent.indexOf('Edge/') > 0)) {
    SECURITY_LEVEL = 1024;
}

function generateKeys() {
    const crypt = new JSEncrypt({ default_key_size: SECURITY_LEVEL });
    crypt.getKey();
    return {
        'private': crypt.getPrivateKey(),
        'public': crypt.getPublicKey()
    };
}

function generateRandomString(length) {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}

const pack = (data, publicKey)=>{
    const encrypted={}, aesKey = generateRandomString(32);
    const encrypter = new JSEncrypt();
    encrypter.setKey(publicKey);

    encrypted['data'] = CryptoJS.AES.encrypt(JSON.stringify(data), aesKey).toString();
    encrypted['aesKey'] = encrypter.encrypt(aesKey)
    return encrypted
}

const unpack = (data, privateKey)=>{
    const decrypter = new JSEncrypt();
    decrypter.setKey(privateKey);

    const aesKey = decrypter.decrypt(data.aesKey);
    var bytes = CryptoJS.AES.decrypt(data.data, aesKey);
    var decrypted =  JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted
}


export {pack, unpack, generateKeys}