import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  try {
    const body = await req.json()
    const user = await User.findById(body.id);
    if (!user)
      return NextResponse.json({ success: false, message: "resource not found" },{status:400});
    user.role = body.role;
    await user.save();
    let accounts = await User.find();
    accounts = accounts.filter(
      (account) => user !== account._id.toString()
    );
    return NextResponse.json({ success: true, message: "role updated successfully", accounts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
