import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
const BASE_URL = 'https://fapi.binance.com'
import { RestClientV5 } from "bybit-api"
import axios from "axios"

const customizeOptions = (body) => {
    console.log(body)
    const { type, side, symbol, options, } = body

    if (type === "MARKET") {
        return { orderid: Date.now() + 2, quantity: parseFloat(parseFloat(options.quantity).toFixed(3)), side, symbol, timestamp: Date.now(), type }
    }
    if (type === "LIMIT") {
        return { orderid: Date.now() + 2, quantity: parseFloat(parseFloat(options.quantity).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)), side, symbol, timestamp: Date.now(), timeInForce: 'GTC', type }
    }
    if (type === "STOP") {
        return { orderid: Date.now() + 2, quantity: parseFloat(parseFloat(options.quantity).toFixed(3)), stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)), side, symbol, timestamp: Date.now(), type }
    }
    if (type === "STOP_MARKET") {
        return { orderid: Date.now() + 2, stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)), }
    }
    if (type === "TRAILING_STOP_MARKET") {
        return { orderid: Date.now() + 2, quantity: parseFloat(parseFloat(options.quantity).toFixed(3)), callbackRate: parseFloat(parseFloat(callbackRate).toFixed(3)), side, symbol, timestamp: Date.now(), type }
    }
}

import ccxt from "ccxt"
export async function POST(req, res) {

    // 80fNrSDmS1TJTZK7IA
    // 1TBrzDsfe39yRaviJs2O2pJDEBFDyIZV8P3Y
    try {
        await isAuthenticated(req, res)
        await dbConnect()
        const body = await req.json()
        const user = await User.findOne({ username: body.user }).select('-password')

        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        const apiKey = user.byBitApiKey;
        const secret = user.byBitSecretKey;
        const exchange = new ccxt.bybit({
            apiKey, secret, enableRateLimit: true, urls: {
                api: {
                    public: 'https://api-testnet.bybit.com',
                    private: 'https://api-testnet.bybit.com',
                },
            },
        })
        // const body = await req.json();
        // const symbol = 'BTCUSDT'; // trading pair
        // const type = 'limit'; // type of order (limit order)
        // const side = 'sell'; // order side (buy or sell)
        // const amount = 0.05; // amount of cryptocurrency to buy
        // const price = 100000; // price at which to buy
        const { symbol, type, side, quantity, price } = body
        // const options = customizeOptions(body)
        let order = undefined;

        console.log(body)
        if (type === 'limit') {
            order = await exchange.createOrder(symbol, type, side, quantity, price, { category: "linear" });
        }
        else if (type === 'market') {
            order = await exchange.createOrder(symbol, type, side, quantity, 0, { category: "linear" });
        }
        else if (type === 'stop_loss') {
            console.log('we"re here')
            const { stopLoss, slLimitPrice } = body
            order = await exchange.createOrder(symbol, 'stop', side, quantity, price, { category: "linear", stopLoss, slLimitPrice });
        }
        else if (type === 'take_profit') {
            const { takeProfit, tpLimitPrice } = body
            order = await exchange.createOrder(symbol, type, side, quantity, price, { category: "linear", takeProfit, tpLimitPrice });
        }
        return NextResponse.json({ success: true, order, message: 'order created successfully' }, { status: 200 })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, error }, { status: 200 })
    }
}

