module.exports = {
    baseUrl: '',
    apiAuth: {
        key: process.env.KU_KEY, // KC-API-KEY
        secret: process.env.KU_SECRET, // API-Secret
        passphrase: process.env.PASSPHRASE, // KC-API-PASSPHRASE
    },
    authVersion: 2, // KC-API-KEY-VERSION. Notice: for v2 API-KEY, not required for v1 version.
};