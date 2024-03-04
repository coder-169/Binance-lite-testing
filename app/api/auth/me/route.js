export const me = async (req, res) => {
    try {
        const data = jwt.verify(req.header('token'), process.env.JWT_SECRET)
        const user = await User.findById(data.id).select('-password')
        if (!user)
            return res.status(400).json({ success: false, message: "user not found" })
        return res.json({ success: true, message: "user found successfully", user })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}