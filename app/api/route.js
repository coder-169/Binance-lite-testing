const API = require('kucoin-node-sdk');

export async function GET(req, res, next) {
    /** Init Configure */
    API.init(require('../config/KuConfig'));
    const getTimestampRl = await API.rest.Others.getTimestamp();
    console.log(getTimestampRl.data);
}