import dbConnect from "@/app/helpers/db"
import { isAuthenticated } from "@/app/helpers/functions"
import User from "@/app/models/User"
import jwt from "jsonwebtoken"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req, res) {
    try {
        await isAuthenticated(req, res)
        await dbConnect()
        const user = await User.findById(req.user).select('-password')
        if (!user)
            return NextResponse.json({ success: false, message: "user not found",   user:req.user }, { status: 404 })
        return NextResponse.json({ success: true, message: "user found successfully", user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}