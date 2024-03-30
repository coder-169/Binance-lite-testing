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
        const ex = new ccxt.kucoinfutures({
            apiKey: process.env.KU_KEY,
            secret: process.env.KU_SECRET,
            password: process.env.PARAPHRASE,
        })
        const resp = await ex.futuresPublicGetContractsActive();

        return NextResponse.json({ success: true, data: resp.data }, { status: 200 })
    } catch (error) {
        console.log(error)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}