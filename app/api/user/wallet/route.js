import { Client } from "@/app/config/WalletConnector"
import User from "@/app/models/User"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Spot } from "@binance/connector"
import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"

// const client = new Spot('hsoidghoasdhigoaihsoh', 'hfoaidshfaosdhfoadigois')
// Get Open Orders

export async function GET(req, res, next) {
    try {
        await isAuthenticated(req, res, next);
        await dbConnect()
        const user = await User.findById(req.user).select('-password')
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
        if (!user.isSubscribed)
            return NextResponse.json({ success: false, message: "sorry you are not subscribed" }, { status: 400 })
    
    //    const client = new Spot(user.api, user.secret)
       const client = new Spot(user.api, user.secret, { baseURL: "https://testnet.binance.vision" })
   
        // const client = new Spot(process.env.ORIG_WALLET_API_KEY, process.env.ORIG_WALLET_SECRET_KEY)
        const { data } = await client.account()
        const assets = data.balances.sort((a, b) => parseFloat(b.free) - parseFloat(a.free));
        return NextResponse.json({ message: 'assets found', success: true, assets }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}