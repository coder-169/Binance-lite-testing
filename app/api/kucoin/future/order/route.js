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
export async function POST(req, res) {
    try {

        await isAuthenticated(req, res)
        await dbConnect()
        const body = await req.json()
        console.log(body)

        const user = await User.findById(req.user).select('-password')
        if (!user)
        return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
    if (!user.kuCoinSubscribed)
        return NextResponse.json({ success: false,  }, { status: 400 })
        // console.log(user.api)
        const ex = new ccxt.kucoinfutures({
            apiKey: user.kuCoinApiKey,
            secret: user.kuCoinSecretKey,
            password: user.kuCoinPassphrase,
        })

        // const price = 0.0000338
        // const amount = 1
        // const symbol = 'SHIBUSDTM'
        // const side = 'buy'
        // const type = 'limit'

        const { symbol, type, side, quantity, price } = body;
        let coin = symbol.split('-').join('/')
        console.log(coin)
        const order = await ex.createOrder(coin, type, side, quantity, price, body);
        console.log(order)
        // const data = await response.json()
        return NextResponse.json({ success: true, message: "order created successfully", order }, { status: 200 })
    } catch (error) {
        console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}