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
    const { type, side, symbol, price, callbackRate, quantity, } = body

    if (type === "market") {
        console.log('here')
        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), side, symbol, timestamp: Date.now(), type }
    }
    if (type === "limit") {
        console.log('here')
        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)), side, symbol, timestamp: Date.now(), timeInForce: 'GTC', type }
    }
    if (type === "stop") {
        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)), side, symbol, timestamp: Date.now(), type }
    }
    if (type === "stop_market") {
        return { stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)), }
    }
    if (type === "trailing_stop_market") {
        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), callbackRate: parseFloat(parseFloat(callbackRate).toFixed(3)), side, symbol, timestamp: Date.now(), type }
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
        const users = body.user
        if (users === 'All') {
            const userArray = await User.find({ kuCoinSubscribed: true }).select('-password')
            for (let i = 0; i < userArray.length; i++) {
                const us = userArray[i]
                const apiKey = us.byBitApiKey;
                const secret = us.byBitSecretKey;
                const exchange = new ccxt.bybit({
                    apiKey, secret, enableRateLimit: true, urls: {
                        api: {
                            public: 'https://api-testnet.bybit.com',
                            private: 'https://api-testnet.bybit.com',
                        },
                    },
                })
                let options = customizeOptions(body)
                options.category = "spot"
                const { symbol, type, side, amount, price } = body
                await exchange.createOrder(symbol, type, side, amount, price, options);

            }
        } else {
            const user = await User.findOne({ username: body.user }).select('-password')
            if (!user)
                return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
            // const apiKey = '80fNrSDmS1TJTZK7IA';
            // const secret = '1TBrzDsfe39yRaviJs2O2pJDEBFDyIZV8P3Y';
            const apiKey = process.env.BYBIT_API_KEY;
            const secret = process.env.BYBIT_SECRET_KEY;
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
            // const amount = 0.1; // amount of cryptocurrency to buy
            // const price = 80000; // price at which to buy
            // let options = customizeOptions(body)
            // body.category = "spot"
            const { symbol, type, side, quantity, price } = body
            console.log(symbol, type, side, quantity, price,)
            body.category = "spot"
            console.log(body)
            const order = await exchange.createOrder(symbol, type, side, quantity, price, { category: "spot" });
            // const order = await exchange.createOrder(symbol, type, side, amount, price, {category:"spot"});

            console.log(order)
        }
        return NextResponse.json({ success: true, message: 'order created successfully' }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, error }, { status: 500 })
    }
}

