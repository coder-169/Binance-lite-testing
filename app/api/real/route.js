import {getFutureSymbols, getSpotSymbols } from "@/app/helpers/functions";
import { NextResponse } from "next/server";


// Example usage

export async function POST(req, res) {
  try {
    
    const symbols = await getFutureSymbols();
    return NextResponse.json({symbols}, { status: 200});
  } catch (error) {
    console.log(error, error.message);
    return NextResponse.json({ error }, { status: 500 });
  }
}

// export async function POST(req, res) {
//   try {
//     const symbols = await getSpotSymbols();
//     return NextResponse.json({symbols}, { status: 200});
//   } catch (error) {
//     console.log(error, error.message);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
// export async function POST(req, res) {
//   try {
//     const body = await req.json();
//     const serverTime = await getServerTime();
//     const params = {
//       symbol: body.symbol,
//       side: body.side,
//       type: body.type,
//       quantity: body.quantity,
//       price: body.price,
//       timeInForce: "GTC",
//       timestamp: serverTime - 1000,
//     };

//     let query = Object.keys(params)
//       .map((key) => `${key}=${encodeURIComponent(params[key])}`)
//       .join("&");
//     const signature = crypto
//       .createHmac("sha256", process.env.WALLET_SECRET_KEY)
//       .update(query)
//       .digest("hex");
//     query += `&signature=${signature}`;
//     const url = "https://api.binance.com/api/v3/order?" + query;
//     console.log(url);
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "X-MBX-APIKEY": process.env.WALLET_API_KEY,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     // console.log(response)
//     const d = await response.json();
//     // console.log(d);
//     return NextResponse.json({ d }, { status: 200 });
//   } catch (error) {
//     console.log(error, error.message);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
