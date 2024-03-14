
import { NextResponse } from "next/server";
import crypto from "crypto"


export async function GET(req, res, next) {
    try {
        const timestamp = Date.now()
        // https://api.mexc.com
        const params = {
            "timestamp": timestamp
        }
        let queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        const signature = crypto.createHmac('sha256', process.env.MEXC_SECRET_KEY).update(queryString).digest('hex')
        queryString += '&signature=' + signature;
        const URL = 'https://contract.mexc.com'+ '/api/v1/private/account/assets';
        // const URL = process.env.MEXC_BASE + '/api/v3/account' + '?' + queryString;
        console.log(URL)
        const headers = {
            'Content-Type': 'application/json',
            'X-MEXC-APIKEY': process.env.MEXC_ACCESS_KEY,
        }

        const resp = await fetch(URL, {
            method: "GET",
            headers
        })
        return NextResponse.json({ success: true, data: await resp.json() }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, data: error }, { status: 500 })
    }
}