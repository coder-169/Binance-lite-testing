import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

const verifyKeys = async (keys, exchange) => {
    if (exchange?.toLowerCase() === 'binance') {
        // const client = new Spot(body.apiKey, body.secretKey, { baseURL: "https://testnet.binance.vision" })
        const client = new Spot(body.apiKey, body.secretKey, { baseURL: "https://testnet.binance.vision" })

        const response = await client.account()
        if (response.status === 200)
            return true;
        const d = await response.json()
        return { status: false, msg: d.msg };
    }
    if (exchange?.toLowerCase() === 'kucoin') { }
    if (exchange?.toLowerCase() === 'mexc') { }
    if (exchange?.toLowerCase() === 'bybit') { }
}
export async function POST(req, res) {
    try {
        await isAuthenticated(req, res)
        await dbConnect()
        const body = await req.json()
        const user = await User.findById(req.user).select('-password')
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })

        // const resp = await verifyKeys({}, '')
        const { exchange, apiKey, secretKey, paraphrase } = body;
        // if (!resp.status)
        //     return NextResponse.json({ success: false, message: resp.msg })
        if (exchange?.toLowerCase() === 'kucoin') {
            const obj = {
                exchange,
                apiKey,
                secretKey,
                paraphrase,
                isSubscribed: true,
            }
            user.exchanges.push(obj)
        }
        if (exchange?.toLowerCase() === 'mexc') {
            const obj = {
                exchange,
                apiKey,
                secretKey,
                isSubscribed: true,
            }
            user.exchanges.push(obj)
        }
        if (exchange?.toLowerCase() === 'bybit') {
            const obj = {
                exchange,
                apiKey,
                secretKey,
                isSubscribed: true,
            }
            user.exchanges.push(obj)
        }
        if (exchange?.toLowerCase() === 'binance') {
            const obj = {
                exchange,
                apiKey,
                secretKey,
                isSubscribed: true,
            }
            user.exchanges.push(obj)
        }
        await user.save()
        return NextResponse.json({ success: true, message: "successfully subscribed", user }, { status: 200 })

    } catch (error) {
        console.log(error.message)
        if (error.response.status === 401) {
            return NextResponse.json({ success: false, message: 'Invalid Api Key or Secret' }, { status: error.response.status })
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
export async function GET(req, res) {
    try {
        const headerList = headers()
        const token = headerList.get('token')
        if (!token)
            return NextResponse.json({ success: false, message: "invalid authorization! please login again" }, { status: 401 })
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(data.id).select('-password')
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })

        user.api = ''
        user.secret = ''
        user.isSubscribed = false
        await user.save()
        return NextResponse.json({ success: true, message: "successfully unsubscribed", user }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}