import dbConnect from "@/app/helpers/db";
import { isAuthenticated } from "@/app/helpers/functions";
import User from "@/app/models/User";
import { Spot } from "@binance/connector";
import ccxt from "ccxt";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const headerList = headers();
    const token = headerList.get("token");
    await dbConnect();
    if (!token)
      return NextResponse.json(
        {
          success: false,
          message: "invalid authorization! please login again",
        },
        { status: 401 }
      );
    const data = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const user = await User.findById(data.id).select("-password");
    if (!user)
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 }
      );

    // const resp = await verifyKeys({}, '')
    const { exchange, apiKey, secretKey, passphrase } = body;
    // if (!resp.status)
    //     return NextResponse.json({ success: false, message: resp.msg })
    console.log(body);
    if (exchange?.toLowerCase() === "kucoin") {
      if (user.kuCoinSubscribed) {
        return NextResponse.json(
          { success: false, message: "User already joined" },
          { status: 400 }
        );
      }
      const ex = new ccxt.kucoin({
        apiKey,
        secret: secretKey,
        password: passphrase,
      });
      const res = await ex.fetchBalance();
      user.kuCoinApiKey = apiKey;
      user.kuCoinSecretKey = secretKey;
      user.kuCoinPassphrase = passphrase;
      user.kuCoinSubscribed = true;
    }
    if (exchange?.toLowerCase() === "bybit") {
      if (user.byBitSubscribed) {
        return NextResponse.json(
          { success: false, message: "User already joined" },
          { status: 400 }
        );
      }
      const ex = new ccxt.bybit({
        apiKey,
        secret: secretKey,
        enableRateLimit: true,
        urls: {
          api: {
            public: "https://api-testnet.bybit.com",
            private: "https://api-testnet.bybit.com",
          },
        },
      });
      const bal = await ex.fetchBalance();
      user.byBitApiKey = apiKey;
      user.byBitSecretKey = secretKey;
      user.byBitSubscribed = true;
    }
    if (exchange?.toLowerCase() === "binance") {
      console.log("we here");
      //   if (user.binanceSubscribed) {
      //     return NextResponse.json(
      //       { success: false, message: "User already joined" },
      //       { status: 400 }
      //     );
      //   }
      //   const client = new Spot(apiKey, secretKey);
      const ex = new ccxt.binance({
        apiKey,
        secret: secretKey,
        enableRateLimit: true,
        options: {
          adjustForTimeDifference: true,
        },
      });
      const data = await ex.fetchBalance();
      console.log(data);
      user.binanceApiKey = apiKey;
      user.binanceSecretKey = secretKey;
      user.binanceSubscribed = true;
    }
    await user.save();
    return NextResponse.json(
      { success: true, message: "successfully subscribed", user },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
export async function GET(req, res) {
  try {
    const body = await req.json();
    const { message } = body;
    console.log(message);
    // Do something with the message (e.g., call Binance API)
    // Example: You can call a function to place an order using Binance API

    return NextResponse.json(
      { success: true, message: "triggered" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
