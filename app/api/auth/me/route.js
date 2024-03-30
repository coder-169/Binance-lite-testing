import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req, res) {
    try {
        // await isAuthenticated(req, res)
        await dbConnect()
        const headerList = headers()
        const token = headerList.get('token')
        if (!token)
            return NextResponse.json({ success: false, message: "invalid authorization! please login again" }, { status: 401 })
        const data = jwt.verify(token, process.env.JWT_SECRET)
        // req.user = data.id    
        const user = await User.findById(data.id).select('-password')
        if (!user)
            return NextResponse.json({ success: false, message: "user not found", data }, { status: 404 })
        console.log(user)
        return NextResponse.json({ success: true, message: "user found successfully", user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}