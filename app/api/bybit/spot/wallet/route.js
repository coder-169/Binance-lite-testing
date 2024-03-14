// // const BASE_URL = 'https://testnet.binancefuture.com'
// const BASE_URL = 'https://fapi.binance.com'

import crypto from 'crypto';
import { NextResponse } from 'next/server';


function getSignature(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export async function GET(req, res) {

    try {
        const apiKey = process.env.BYBIT_API_KEY;
        const secret = process.env.BYBIT_SECRET_KEY;
        const recvWindow = '5000';
        const timestamp = Date.now().toString();
        const parameters = {
            accountType: "UNIFIED"
        }
        let url = process.env.BYBIT_BASE + '/v5/asset/transfer/query-account-coins-balance';
        let queryString = Object.keys(parameters).map(key => `${key}=${encodeURIComponent(parameters[key])}`).join('&');
        url = url + '?' + queryString;
        const sign = getSignature(timestamp + apiKey + recvWindow + queryString, secret);
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'X-BAPI-SIGN-TYPE': '2',
                'X-BAPI-SIGN': sign,
                'X-BAPI-API-KEY': apiKey,
                'X-BAPI-TIMESTAMP': timestamp,
                'X-BAPI-RECV-WINDOW': '5000',
                'Content-Type': 'application/json; charset=utf-8'
            },
        })
        return NextResponse.json({ success: true, response: await resp.json() }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ success: false, error }, { status: 200 })
    }
}
