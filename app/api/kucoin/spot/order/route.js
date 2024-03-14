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
        const ex = new ccxt.kucoin({
            apiKey: process.env.KU_KEY,
            secret: process.env.KU_SECRET,
            password: process.env.PARAPHRASE,
        })
        const symbol = 'SHIB/USDT'; // trading pair
        const type = 'limit'; // type of order (limit order)
        const side = 'sell'; // order side (buy or sell)
        const amount = 200000; // amount of cryptocurrency to buy
        const price = 97; // price at which to buy
        const order = await ex.createOrder(symbol, type, side, amount,price,{

        });
        // const data = await response.json()
        return NextResponse.json({ success: true, message: "order created successfully", order }, { status: 200 })
    } catch (error) {
        // console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}