const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const generateKeys = function () {
    const key = new NodeRSA({ b: 2048 });
    return {
        'private': key.exportKey('pkcs1-private-pem'),
        'public': key.exportKey('pkcs8-public-pem')
    };
};

const rsa = {

    encrypt: function (message, publicKey) {
        const buffer = new Buffer.from(message);
        const encrypted = crypto.publicEncrypt({
                                key: publicKey,
                                padding: crypto.constants.RSA_PKCS1_PADDING
                          }, buffer);

        return encrypted.toString('base64');
    },

    decrypt: function (message, privateKey) {
        const buffer =  new Buffer.from(message, 'base64');
        const decrypted = crypto.privateDecrypt({
                                key: privateKey,
                                padding: crypto.constants.RSA_PKCS1_PADDING
                           }, buffer);

        return decrypted.toString('utf8');
    }
};

const pack = function (aesKey, publicKey) {
    return  rsa.encrypt(aesKey, publicKey);
};


const unpack = function (aesKey, privateKey) {
    return rsa.decrypt(aesKey, privateKey);
};

module.exports = {
    pack: pack,
    unpack: unpack,
    generateKeys: generateKeys
};