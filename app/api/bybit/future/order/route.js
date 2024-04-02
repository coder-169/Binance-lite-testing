import dbConnect from "@/app/helpers/db";
import { isAuthenticated } from "@/app/helpers/functions";
import User from "@/app/models/User";
import { Spot } from "@binance/connector";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
const BASE_URL = "https://fapi.binance.com";
import { RestClientV5 } from "bybit-api";
import axios from "axios";

const customizeOptions = (body) => {
  console.log(body);
  const { type, side, symbol, options } = body;

  if (type === "MARKET") {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(options.quantity).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      type,
    };
  }
  if (type === "LIMIT") {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(options.quantity).toFixed(3)),
      price: parseFloat(parseFloat(price).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      timeInForce: "GTC",
      type,
    };
  }
  if (type === "STOP") {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(options.quantity).toFixed(3)),
      stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)),
      price: parseFloat(parseFloat(price).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      type,
    };
  }
  if (type === "STOP_MARKET") {
    return {
      orderid: Date.now() + 2,
      stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)),
    };
  }
  if (type === "TRAILING_STOP_MARKET") {
    return {
      orderid: Date.now() + 2,
      quantity: parseFloat(parseFloat(options.quantity).toFixed(3)),
      callbackRate: parseFloat(parseFloat(callbackRate).toFixed(3)),
      side,
      symbol,
      timestamp: Date.now(),
      type,
    };
  }
};

import ccxt from "ccxt";
export async function POST(req, res) {
  // 80fNrSDmS1TJTZK7IA
  // 1TBrzDsfe39yRaviJs2O2pJDEBFDyIZV8P3Y
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
    const body = await req.json();
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id).select("-password");
    const users = body.user;
    let order = null;
    if (users === "All") {
      const userArray = await User.find({ byBitSubscribed: true }).select(
        "-password"
      );

      if (!userArray)
        return NextResponse.json(
          { success: false, message: "users not found" },
          { status: 404 }
        );
      for (let i = 0; i < userArray.length; i++) {
        const us = userArray[i];
        const apiKey = us.byBitApiKey;
        const secret = us.byBitSecretKey;
        const exchange = new ccxt.bybit({
          apiKey,
          secret,
          enableRateLimit: true,
          urls: {
            api: {
              public: 'https://api-testnet.bybit.com',
              private: 'https://api-testnet.bybit.com',
            },
          },
        });
        const { symbol, type, side, quantity, price } = body;
        // const options = customizeOptions(body)
        let order = undefined;
        if (type === "limit") {
          await exchange.createOrder(symbol, type, side, quantity, price, {
            category: "linear",
          });
        } else if (type === "market") {
          await exchange.createOrder(symbol, type, side, quantity, 0, {
            category: "linear",
          });
        } else if (type === "stop_loss") {
          const { stopLoss, slLimitPrice } = body;
          await exchange.createOrder(symbol, "limit", side, quantity, price, {
            category: "linear",
            stopLoss,
            slLimitPrice,
            slOrderType: "limit",
          });
        } else if (type === "take_profit") {
          const { takeProfit, tpLimitPrice } = body;
          await exchange.createOrder(symbol, type, side, quantity, price, {
            category: "linear",
            takeProfit,
            tpLimitPrice,
          });
        }
      }
      return NextResponse.json(
        { success: true, order, message: "orders created successfully" },
        { status: 200 }
      );
    } else {
      const user = await User.findOne({ username: body.user });
      const apiKey = user.byBitApiKey;
      const secret = user.byBitSecretKey;
      const exchange = new ccxt.bybit({
        apiKey,
        secret,
        enableRateLimit: true,
        urls: {
          api: {
            public: 'https://api-testnet.bybit.com',
            private: 'https://api-testnet.bybit.com',
          },
        },
      });
      const { symbol, type, side, quantity, price } = body;
      // const options = customizeOptions(body)

      if (type === "limit") {
        order = await exchange.createOrder(
          symbol,
          type,
          side,
          quantity,
          price,
          { category: "linear" }
        );
      } else if (type === "market") {
        order = await exchange.createOrder(symbol, type, side, quantity, 0, {
          category: "linear",
        });
      } else if (type === "stop_loss") {
        const { stopLoss, slLimitPrice } = body;
        order = await exchange.createOrder(
          symbol,
          "stop",
          side,
          quantity,
          price,
          { category: "linear", stopLoss, slLimitPrice }
        );
      } else if (type === "take_profit") {
        const { takeProfit, tpLimitPrice } = body;
        order = await exchange.createOrder(
          symbol,
          type,
          side,
          quantity,
          price,
          { category: "linear", takeProfit, tpLimitPrice }
        );
      }
      return NextResponse.json(
        { success: true, order, message: "order created successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ success: false, error }, { status: 200 });
  }
}
