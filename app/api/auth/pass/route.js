export const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user)
            return res.status(400).json({ success: false, message: "user not found" })

        const match = await bcryptjs.compare(req.body.oldPassword, user.password)
        if (!match) {
            return res.status(400).json({ success: false, message: "old password is wrong", user })
        }
        user.password = await bcryptjs.hash(req.body.newPassword, 10)
        await user.save()
        return res.json({ success: true, message: "password updated successfully", user })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}