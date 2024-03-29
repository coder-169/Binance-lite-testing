import mongoose from "mongoose"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import dbConnect from "@/app/helpers/db"
import bcryptjs from "bcryptjs"
import { generateCode, sendEmail } from "@/app/helpers/functions"
import User from "@/app/models/User"

export async function POST(req, res) {

    try {
        await dbConnect()
        let body = await req.json();
        let user = await User.findOne({ $or: [{ email: body.email }, { username: body.username }, { phone: body.phone }] })
        let code = await generateCode()
        const { username, email, phone, password, apiKey, secretKey } = body
        if (user)
            return NextResponse.json({ success: false, message: `try different Details` }, {
                status: 400
            })

        if (!user) {
            const hashedPass = await bcryptjs.hash(password, 10)
            user = await User.create({ username, email, phone, password: hashedPass, api: apiKey, secret: secretKey })
        }
        const mailOptions = {
            from: process.env.EMAIL,
            to: body.email,
            subject: `Account Verification Code`,
            text: `Hi ${user.username}, \n\n Your account is created you have to verify by entering this ${code} code (it will expire in 10 minutes) and then you can login with your credentials`,
        };

        await sendEmail(req, res, mailOptions);
        return NextResponse.json({ success: true, code, message: `We've sent you an email, please verify your account.` }, {
            status: 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}

// GEt
export const resendCode = async (req, res) => {
    try {
        // const { email } = req. // from req.headers
        if (!email)
            return res.json({ success: false, message: 'invalid email' })
        const user = await User.findOne({ email });
        if (!user)
            return res.json({ success: false, message: 'user not found' })
        let code = await generateCode()
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            // to: 'info@mawsool.tech',
            subject: `Account Verification Code`,
            text: `Hi ${user.firstName}, \n\n Your account is created you have to verify by entering this ${code} code (it will expire in 10 minutes) and then you can login with your credentials`,
        }
        sendEmail(req, res, mailOptions)
        return res.json({ success: true, message: 'Email Resend Successful', code })
    } catch (error) {
        return res.json({ success: true, message: error.message })
    }
}