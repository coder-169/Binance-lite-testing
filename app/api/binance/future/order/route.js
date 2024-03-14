import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto, { sign } from "crypto"
const BASE_URL = 'https://fapi.binance.com'
// // Get Open Orders
// export async function GET(req, res) {
//     try {
//         await isAuthenticated(req, res)
//         await dbConnect()
//         const user = await User.findOne({ username: body.user }).select('-password')
//         if (!user)
//             return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })

//         const client = new Spot(user.api, user.secret, { baseURL: "https://testnet.binance.vision" })

//         const { data } = await client.account()
//         return NextResponse.json({ success: true, data }, { status: 200 })
//     } catch (error) {
//         console.log(error)
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 })
//     }
// }

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
export async function POST(req, res) {
    try {

        const body = await req.json()
        await isAuthenticated(req, res)
        await dbConnect()
        const user = await User.findOne({ username: body.user }).select('-password')
        if (!user)
            return NextResponse.json({ message: 'some error occurred! we did not found user' }, { status: 404 })
        const params = customizeOptions(body);
        console.log(params)
        let queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        const signature = crypto.createHmac('sha256', process.env.ORIG_WALLET_SECRET_KEY).update(queryString).digest('hex')
        queryString += '&signature=' + signature;
        // const url = BASE_URL + `/fapi/v1/order/test?` + queryString;
        const url = BASE_URL + `/fapi/v1/order?` + queryString;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'X-MBX-APIKEY': process.env.ORIG_WALLET_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const data = await response.json()
        if (response.status === 200) {
            return NextResponse.json({ success: true, message: "order created successfully", res }, { status: 200 })
        }
        return NextResponse.json({ success: false, message: data.msg, res }, { status: response.status })
    } catch (error) {
        // console.log(error.response)
        if (!error.response)
            return NextResponse.json({ success: false, message: error.message }, { status: 500 })
        return NextResponse.json({ success: false, message: error.response.data.msg }, { status: 500 })
    }
}