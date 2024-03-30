
import { Spot } from "@binance/connector"
import { headers } from "next/headers"
import crypto from "crypto"
import { NextResponse } from "next/server"
import ccxt from "ccxt"
const BASE_URL = 'https://fapi.binance.com'
export async function POST(req, res) {
    try {
        const headerList = headers();
        const mark = headerList.get('mark')
        const body = await req.json()
        let tickerPrice = 0;
        if (mark === 'spot') {
            const exfuture = new ccxt.binance({
                apiKey: process.env.WALLET_API_KEY,
                secret: process.env.WALLET_SECRET_KEY,
            })
            const res = await exfuture.publicGetTickerPrice({ symbol: body.ticker })
            tickerPrice = res.price
        } else {
            const exfuture = new ccxt.binance({
                apiKey: process.env.WALLET_API_KEY,
                secret: process.env.WALLET_SECRET_KEY,
            })
            const res = await exfuture.fapiPublicV2GetTickerPrice({ symbol: body.ticker })
            tickerPrice = res.price
        }
        return NextResponse.json({ tickerPrice, success: true, message: "price found successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}