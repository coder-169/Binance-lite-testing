
import { NextResponse } from "next/server"
import { Spot } from "@binance/connector"
import User from "@/app/models/User"
import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"

// Get Open Orders
export async function POST(req, res) {
    try {
        const body = await req.json()
        await isAuthenticated(req, res)
        await dbConnect()
        // const client = new Spot(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
        const client = new Spot(process.env.WALLET_API_KEY, process.env.WALLET_SECRET_KEY, { baseURL: "https://testnet.binance.vision" })
        if (!client)
            return NextResponse.json({ success: false, message: 'client not created' })

        const { data } = await client.tickerPrice(body.ticker)
        return NextResponse.json({ success: true, message: 'ticker price found', tickerPrice: data.price }, { status: 200 })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}