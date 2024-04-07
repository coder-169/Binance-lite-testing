import { NextResponse } from "next/server";


export async function POST(req, res) {
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
