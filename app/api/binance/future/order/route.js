import dbConnect from "@/app/helpers/db";
import { isAuthenticated } from "@/app/helpers/functions";
import User from "@/app/models/User";
import { Spot } from "@binance/connector";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import ccxt from "ccxt";

const customizeOptions = (body) => {
  console.log(body);
  const { type, side, symbol, options, quantity, price } = body;

  if (type === "MARKET".toLocaleLowerCase()) {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(quantity).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      type,
    };
  }
  if (type === "LIMIT".toLocaleLowerCase()) {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(quantity).toFixed(3)),
      price: parseFloat(parseFloat(price).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      timeInForce: "GTC",
      type,
    };
  }
  if (type === "STOP".toLocaleLowerCase()) {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(quantity).toFixed(3)),
      stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)),
      price: parseFloat(parseFloat(price).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      type,
    };
  }
  if (type === "STOP_MARKET".toLocaleLowerCase()) {
    return {
      orderid: Date.now() + 2,
      stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)),
    };
  }
  if (type === "TRAILING_STOP_MARKET".toLocaleLowerCase()) {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(quantity).toFixed(3)),
      callbackRate: parseFloat(parseFloat(callbackRate).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      type,
    };
  }
};
export async function POST(req, res) {
  try {
    const body = await req.json();
    const headerList = headers();
    await dbConnect();
    const token = headerList.get("token");
    if (!token)
      return NextResponse.json(
        {
          success: false,
          message: "invalid authorization! please login again",
        },
        { status: 401 }
      );
    const user = await User.findOne({ username: body.user }).select(
      "-password"
    );
    if (!user)
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 }
      );
    const users = body.user;
    if (users === "all") {
      const userArray = await User.find({ binanceSubscribed: true }).select(
        "-password"
      );
      for (let i = 0; i < userArray.length; i++) {
        let us = userArray[i];
        const exfuture = new ccxt.binanceusdm({
          apiKey: us.binanceApiKey,
          secret: us.binanceSecretKey,
        });
        const { symbol, price, leverage, stopPrice, quantity, side, type } =
          body;
        const ord = await exfuture.createOrder(
          symbol,
          type,
          side,
          quantity,
          price,
          { stopPrice, leverage }
        );
      }
    } else {
      const user = await User.findOne({ username: body.user }).select(
        "-password"
      );
      const exfuture = new ccxt.binanceusdm({
        apiKey: user.binanceApiKey,
        secret: user.binanceSecretKey,
      });
      const { symbol, leverage, price, stopPrice, quantity, side, type } = body;
      const ord = await exfuture.createOrder(
        symbol,
        type,
        side,
        quantity,
        price,
        { stopPrice, leverage }
      );
      return NextResponse.json(
        { success: true, message: "order created successfully", ord },
        { status: 200 }
      );
    }
  } catch (error) {
    // console.log(error.response)
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
