// const BASE_URL = 'https://testnet.binancefuture.com'
const BASE_URL = 'https://fapi.binance.com'

import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
export async function GET(req, res) {
    try {

        await isAuthenticated(req, res)
        await dbConnect()
        const user = await User.findById(req.user).select('-password')
        // const user = await User.findOne({ username: req.user }).select('-password')
        // const client = new Spot(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        if (!user.byBitSubscribed)
            return NextResponse.json({ success: false, message: "user not subscribed" }, { status: 400 })
        const params = {
            timestamp: Date.now(),
        }
        let queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        const signature = crypto.createHmac('sha256', user.byBitSecretKey).update(queryString).digest('hex')
        queryString += '&signature=' + signature;
        const url = BASE_URL + `/fapi/v2/account?` + queryString;
        console.log(url)
        const response = await fetch(url, {
            headers: {
                'X-MBX-APIKEY': user.byBitApiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        console.log(response)
        const data = await response.json()

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error) {
        console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}