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
        if (!user.binanceSubscribed) 
            return NextResponse.json({ success: false,  }, { status: 400 })
        const ex = new ccxt.binance({
            apiKey: user.binanceApiKey,
            secret: user.binanceSecretKey,
        })
        const response = await ex.fetchBalance();
        const assets = []
        Object.keys(response).map(asset => { if (response[asset].total > 0) assets.push({ ...response[asset], asset }) });
        // const assets = response.filter(asset => asset.total > 0)
        return NextResponse.json({ success: true, assets }, { status: 200 })
    } catch (error) {
        console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}