import CryptoJS from 'crypto-js';

export const encrypt = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
}

export const decrypt = (text, key) => {
    const bytes = CryptoJS.AES.decrypt(text, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}