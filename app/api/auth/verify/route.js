import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        let body = await req.json();
        const { email } = body

        if (!email)
            return NextResponse.json({ success: false, message: 'invalid id' }, { status: 400 })
        let user = await User.findOne({ email })
        // console.log(user)
        if (!user)
            return NextResponse.json({ success: false, message: 'user not found maybe invalid id' }, { status: 400 })

        if (user.isVerified) {
            return NextResponse.json({ success: true, message: 'account already verified' }, { status: 200 })
        }
        user.isVerified = true
        await user.save()
        return NextResponse.json({ success: true, message: 'Account Verified Successfully', user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: error.message, success: false }, { status: 500 })
    }
}