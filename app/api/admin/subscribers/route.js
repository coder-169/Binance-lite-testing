import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import { Spot } from "@binance/connector"
import ccxt from "ccxt"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
export async function GET(req, res) {
    try {
        await dbConnect()
        await isAuthenticated(req, res)
        const user = await User.findById(req.user).select('-password');
        if (!user)
            return NextResponse.json({ success: false, message: "user not found" }, { status: 404 })

        let subscribers = []
        // if (!subscribers)
        //     return NextResponse.json({ success: false, message: "users not found" }, { status: 404 })
        const headerList = headers();
        const ex = headerList.get('exchange')
        let tickers = [];
        let tickersFuture = [];
        if (ex === 'kucoin') {
            subscribers = await User.find({ kuCoinSubscribed: true });
            const exc = new ccxt.kucoin({
                apiKey: process.env.KU_KEY,
                secret: process.env.KU_SECRET,
                password: process.env.PARAPHRASE,
            })
            const excfuc = new ccxt.kucoinfutures({
                apiKey: process.env.KU_KEY,
                secret: process.env.KU_SECRET,
                password: process.env.PARAPHRASE,
            })
            const resp = await exc.publicGetMarketAllTickers();
            const respf = await excfuc.futuresPublicGetContractsActive();
            tickers = resp.data.ticker.sort((a, b) => {
                if (a.symbol > b.symbol) {
                    return 1;
                } else if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 0;
                }
            });
            tickersFuture = respf.data.sort((a, b) => {
                if (a.symbol > b.symbol) {
                    return 1;
                } else if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        let coins;
        let coinsFuture;
        if (ex === 'binance') {
            subscribers = await User.find({ binanceSubscribed: true });

            const ex = new ccxt.binance({
                apiKey: user.api,
                secret: user.secret,
            })
            coins = await ex.publicGetExchangeInfo()
            coinsFuture = await ex.fapiPublicGetExchangeInfo()
            console.log(coinsFuture)
            tickers = coins.symbols.sort((a, b) => {
                if (a.symbol > b.symbol) {
                    return 1;
                } else if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 0;
                }
            });

            tickersFuture = coinsFuture.symbols.sort((a, b) => {
                if (a.symbol > b.symbol) {
                    return 1;
                } else if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        if (ex === 'bybit') {
            subscribers = await User.find({ byBitSubscribed: true });
            const apiKey = process.env.BYBIT_API_KEY;
            const secret = process.env.BYBIT_SECRET_KEY;
            const exchange = new ccxt.bybit({
                apiKey, secret, enableRateLimit: true, urls: {
                    api: {
                        public: 'https://api-testnet.bybit.com',
                        private: 'https://api-testnet.bybit.com',
                    },
                },
            })
            const respp = await exchange.publicGetV5MarketTickers({ category: "spot" });
            const resp = await exchange.publicGetV5MarketTickers({ category: "linear" });
            coins = respp.result.list
            tickersFuture =  resp.result.list.sort((a, b) => {
                if (a.symbol > b.symbol) {
                    return 1;
                } else if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 0;
                }
            });
            tickers = coins.sort((a, b) => {
                if (a.symbol > b.symbol) {
                    return 1;
                } else if (a.symbol < b.symbol) {
                    return -1;
                } else {
                    return 0;
                }
            });

        }
        return NextResponse.json({ tickers, tickersFuture, success: true, message: "subscribers found successfully", subscribers }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}