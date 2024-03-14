
'use server'
import { NextResponse } from "next/server";
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
export const generateTimestamp = async (wind = 60000) => {
    var recvWindow = wind; // Maximum value for recvWindow
    var currentTimestamp = new Date().getTime();

    // Ensure the timestamp is within the recvWindow range
    var timestamp = Math.min(currentTimestamp, currentTimestamp + recvWindow);

    return timestamp;
}
export const generateCode = async () => {
    let code = (Math.floor(100000 + Math.random() * 900000)).toString();
    return code;
}
export const sendEmail = async (req, res, mailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.HOST,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
export const makeOptions = async ({ quantity, symbol, limit, type, quoteOrderQty, side, stopPrice, price }) => {
    if (type === "MARKET") {
        return quantity === '' ? { error: true } : { quantity: parseFloat(parseFloat(quantity).toFixed(3)), }
    }
    if (type === "LIMIT") {
        if (quantity === '' || price === '')
            return { error: true }
        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)), timeInForce: 'GTC', }
    }
    if (type === "STOP_LOSS") {
        if (quantity === '' || stopPrice === '')
            return { error: true }

        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)) }
    }
    if (type === "STOP_LOSS_LIMIT") {
        if (quantity === '' || price === '' || stopPrice === '')
            return { error: true }

        return { timeInForce: 'GTC', quantity: parseFloat(parseFloat(quantity).toFixed(3)), stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)) }
    }
    if (type === "TAKE_PROFIT") {
        if (quantity === '' || stopPrice === '')
            return { error: true }

        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)) }
    }
    if (type === "TAKE_PROFIT_LIMIT") {
        if (quantity === '' || price === '' || stopPrice === '')
            return { error: true }

        return { timeInForce: 'GTC', quantity: parseFloat(parseFloat(quantity).toFixed(3)), stopPrice: parseFloat(parseFloat(stopPrice).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)) }
    }
    if (type === "LIMIT_MAKER") {
        if (quantity === '' || price === '')
            return { error: true }
        return { quantity: parseFloat(parseFloat(quantity).toFixed(3)), price: parseFloat(parseFloat(price).toFixed(3)) }
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        const headerList = headers()
        const token = headerList.get('token')
        if (!token)
            return NextResponse.json({ success: false, message: "invalid authorization! please login again" }, { status: 401 })
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.id
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    }
}