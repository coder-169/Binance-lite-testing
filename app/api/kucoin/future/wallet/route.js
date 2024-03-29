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
import ccxt from "ccxt"
export async function GET(req, res) {
    try {

        await isAuthenticated(req, res)
        await dbConnect()
        const user = await User.findById(req.user).select('-password')
        if (!user)
        return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
    if (!user.kuCoinSubscribed)
        return NextResponse.json({ success: false, message: "Sorry you are not subscribed" }, { status: 400 })
        // console.log(user.api)
        const ex = new ccxt.kucoinfutures({
            apiKey: user.kuCoinApiKey,
            secret: user.kuCoinSecretKey,
            password: user.kuCoinPassphrase,
        })
        const resp = await ex.fetchBalance()

        return NextResponse.json({ success: true, data: resp }, { status: 200 })
    } catch (error) {
        console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}