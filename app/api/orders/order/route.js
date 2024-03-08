import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

// Get Open Orders
export async function GET(req, res) {
    try {
        await isAuthenticated(req, res)
        await dbConnect()
        const user = await User.findOne({ username: body.user }).select('-password')
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })

        const client = new Spot(user.api, user.secret, { baseURL: "https://testnet.binance.vision" })

        const { data } = await client.account()
        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}


export async function POST(req, res) {
    try {

        const body = await req.json()
        await isAuthenticated(req,res)
        await dbConnect()
        console.log(body)
        const user = await User.findOne({ username: body.user }).select('-password')
        console.log(user)
        // const client = new Spot(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        if (!user.isSubscribed)
            return NextResponse.json({ success: false, message: "user not subscribed" }, { status: 400 })
        const client = new Spot(user.api, user.secret, { baseURL: "https://testnet.binance.vision" })
        const { symbol, type, side, options } = body;
        const response = await client.newOrder(symbol, side, type, options)
        if (response.status !== 200)
            return NextResponse.json({ success: false, message: response.statusText, res }, { status: 200 })
        return NextResponse.json({ success: true, message: "order created successfully", res }, { status: 200 })
    } catch (error) {
        // console.log(error.response)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })

        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}