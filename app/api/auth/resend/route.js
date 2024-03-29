import { sendEmail } from "@/app/helpers/functions";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req,res) {
    try {
        const { email } = req.body
        if (!email)
            return NextResponse.json({ success: false, message: 'invalid email' })
        const user = await User.findOne({ email });
        if (!user)
            return res.json({ success: false, message: 'user not found' })
        let code = await generateCode()
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            // to: 'info@mawsool.tech',
            subject: `Account Verification Code`,
            text: `Hi ${user.username}, \n\n Your account is created you have to verify by entering this ${code} code (it will expire in 10 minutes) and then you can login with your credentials`,
        }
        sendEmail(req, res, mailOptions)
        return NextResponse.json({ success: true, message: 'mail sent', code })
    } catch (error) {
        return NextResponse.json({ success: true, message: error.message }, { status: 500 })
    }
}