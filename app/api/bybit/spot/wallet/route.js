// // const BASE_URL = 'https://testnet.binancefuture.com'
// const BASE_URL = 'https://fapi.binance.com'

import dbConnect from '@/app/helpers/db';
import User from '@/app/models/User';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken"

function getSignature(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export async function GET(req, res) {

    try {
        const headerList = headers()
        const token = headerList.get('token')
        await dbConnect()
        if (!token)
            return NextResponse.json({ success: false, message: "invalid authorization! please login again" }, { status: 401 })
        const da = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(da.id).select('-password');
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        
        const apiKey = user.byBitApiKey;
        const secret = user.byBitSecretKey;
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
        const data = await resp.json();
        console.log(data)
        const assets = data.result.balance.filter(asset => asset.walletBalance > 0)
        return NextResponse.json({ success: true, assets }, { status: 200 })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, error }, { status: 500 })
    }
}
