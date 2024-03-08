import User from "@/app/models/User"
import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "@/app/helpers/db"
export async function POST(req, res) {
    try {
        let body = await req.json()
        await dbConnect()
        const { loginId, password } = body
        const user = await User.findOne({ $or: [{ email: loginId }, { username: loginId }] })
        if (!user)
        return NextResponse.json(
                { success: false, message: "invalid credentials" }, {
                status: 404
            })

        const match = await bcryptjs.compare(password, user.password)
        if (!match)
            return NextResponse.json({ success: false, message: "invalid credentials" }, {
                status: 404
            })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' })
        return NextResponse.json({ success: true, message: "login successful", user, token }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, {
            status: 500
        })
    }
}