// const BASE_URL = 'https://testnet.binancefuture.com'


import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
import ccxt from "ccxt"

function sign(text, secret, outputType = 'base64') {
    return crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest(outputType);
}

export async function GET(req, res) {
    try {
        console.log('called')
        const ex = new ccxt.kucoin({
            apiKey: process.env.KU_KEY,
            secret: process.env.KU_SECRET,
            password: process.env.PARAPHRASE,
        })
        const response = await ex.fetchBalance()
        console.log(response)
        // await isAuthenticated(req, res)
        // await dbConnect()
        // const user = await User.findById(req.user).select('-password')
        // const user = await User.findOne({ username: req.user }).select('-password')
        // // const client = new Spot(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
        // if (!user)
        //     return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        // if (!user.isSubscribed)
        //     return NextResponse.json({ success: false, message: "user not subscribed" }, { status: 400 })
        // const url = process.env.KU_BASE + `/api/v2/user-info`;
        // const timestamp = Date.now()
        // const signature = sign(timestamp + "GET" + '/api/v2/user-info' + "", process.env.KU_SECRET,);
        // console.log(url)
        // const headers = {
        //     'KC-API-KEY': process.env.KU_KEY,
        //     'KC-API-SIGN': signature,
        //     'KC-API-TIMESTAMP': timestamp,
        //     'KC-API-PASSPHRASE': process.env.PARAPHRASE || '',
        //     'KC-API-KEY-VERSION': 2,
        // }
        // console.log(headers)
        // const response = await fetch(url, {
        //     method: "GET",
        //     headers: {
        //         'KC-API-KEY': process.env.KU_KEY,
        //         'KC-API-SIGN': signature,
        //         'KC-API-TIMESTAMP': timestamp,
        //         'KC-API-PASSPHRASE': process.env.PARAPHRASE || '',
        //         'Content-Type': 'application/json',
        //         'KC-API-KEY-VERSION': 2,
        //     }
        // })

        // if (response.status !== 200)
        //     return NextResponse.json({ success: false, response }, { status: 200 })
        // const data = await response.json()
        return NextResponse.json({ success: true, message: "order created successfully", response }, { status: 200 })
    } catch (error) {
        console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}