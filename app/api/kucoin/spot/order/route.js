import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
// const BASE_URL = 'https://api-futures.kucoin.com'
const BASE_URL = 'https://api.kucoin.com'
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto"
import ccxt from "ccxt"


function sign(text, secret, outputType = 'base64') {
    return crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest(outputType);
}

export async function POST(req, res) {
    try {
        const headerList = headers()
        const token = headerList.get('token')
        await dbConnect()
        if (!token)
            return NextResponse.json({ success: false, message: "invalid authorization! please login again" }, { status: 401 })
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(data.id).select('-password');
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        
        const body = await req.json()
        const users = body.user;
        let order = undefined
        if (users === 'All') {
            const userArray = await User.find({ kuCoinSubscribed: true }).select('-password')
            for (let i = 0; i < userArray.length; i++) {
                const us = userArray[i]
                const exUser = new ccxt.kucoin({
                    apiKey: us.kuCoinApiKey,
                    secret: us.kuCoinSecretKey,
                    password: us.kuCoinPassphrase,
                })
                const { symbol, type, side, quantity, price } = body;
                let coin = symbol.split('-').join('/')
                await exUser.createOrder(coin, type, side, quantity, price, body);
            }
        } else {
            const user = await User.findOne({ username: body.user }).select('-password')
            if (!user)
                return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
            if (!user.kuCoinSubscribed)
                return NextResponse.json({ success: false, message: "Sorry you are not subscribed" }, { status: 400 })
            // console.log(user.api)
            const ex = new ccxt.kucoin({
                apiKey: user.kuCoinApiKey,
                secret: user.kuCoinSecretKey,
                password: user.kuCoinPassphrase,
            })
            const { symbol, type, side, quantity, price } = body;
            let coin = symbol.split('-').join('/')
            const order = await ex.createOrder(coin, type, side, quantity, price, body);
        }

        // const data = await response.json()
        return NextResponse.json({ success: true, message: "order created successfully", order }, { status: 200 })
    } catch (error) {
        // console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}