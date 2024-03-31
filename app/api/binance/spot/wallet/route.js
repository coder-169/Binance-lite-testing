// const BASE_URL = 'https://testnet.binancefuture.com'
const BASE_URL = "https://fapi.binance.com";

import dbConnect from "@/app/helpers/db";
import { getServerTime, isAuthenticated } from "@/app/helpers/functions";
import User from "@/app/models/User";
import { Spot } from "@binance/connector";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import ccxt from "ccxt";
export async function GET(req, res) {
  try {
    // const headerList = headers()
    // const token = headerList.get('token')
    // await dbConnect()
    // if (!token)
    //     return NextResponse.json({ success: false, message: "invalid authorization! please login again" }, { status: 401 })
    // const data = jwt.verify(token, process.env.JWT_SECRET)
    // const user = await User.findById(data.id).select('-password');
    // if (!user)
    //     return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })
    // if (!user.binanceSubscribed)
    //     return NextResponse.json({ success: false, }, { status: 400 })
    // const ex = new ccxt.binance({
    //     apiKey: user.binanceApiKey,
    //     secret: user.binanceSecretKey,
    // })
    // const response = await ex.fetchBalance();

    // console.log(await getServerTime())
    // // const timestamp = (await getServerTime()) - 0;
    // // console.log(timestamp)
    // const params = { timestamp:Date.now().toString() };
    // let query = Object.keys(params)
    //   .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    //   .join("&");
    // const signature = crypto
    //   .createHmac("sha256", process.env.WALLET_SECRET_KEY)
    //   .update(query)
    //   .digest("hex");
    // query += `&signature=${signature}`;
    // const url = "https://api.binance.com/api/v3/account?" + query;
    // const response = await fetch(url, {
    //   method: "GET",
    //   headers: {
    //     "X-MBX-APIKEY": process.env.WALLET_API_KEY,
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // });
    // const d = await response.json();
    // console.log(d);
    const client = new Spot(process.env.WALLET_API_KEY, process.env.WALLET_SECRET_KEY)
    client
      .account()
      .then((response) => client.logger.log(response))
      .catch((error) => client.logger.error(error));
    const assets = [];
    Object.keys(response).map((asset) => {
      if (response[asset].total > 0) assets.push({ ...response[asset], asset });
    });
    // const assets = response.filter(asset => asset.total > 0)
    return NextResponse.json({ success: true, assets }, { status: 200 });
  } catch (error) {
    if (!error.response)
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );

    return NextResponse.json(
      { success: false, message: error.response.data.msg },
      { status: 500 }
    );
  }
}
