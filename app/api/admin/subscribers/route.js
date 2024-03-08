import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
export async function GET(req, res) {
    try {
        await dbConnect()
        await isAuthenticated(req, res)
        const user = await User.findById(req.user).select('-password');
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        const subscribers = await User.find({ isSubscribed: true })
        if (!subscribers)
            return NextResponse.json({ success: false, message: "users not found" }, { status: 404 })
        let client;
        if (process.env.MODE = 'production')
            client = new Spot(user.api, user.secret,)
        else
            client = new Spot(user.api, user.secret, { baseURL: "https://testnet.binance.vision" })
        console.log(client)
        const { data } = await client.exchangeInfo()
        const symbols = data.symbols.filter(symbol => symbol.quoteAsset === 'USDT')
        return NextResponse.json({ symbols, success: true, message: "subscribers found successfully", subscribers }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}