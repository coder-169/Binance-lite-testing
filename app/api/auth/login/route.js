async (req, res) => {
    const { loginId, password } = req.body
    try {
        const user = await User.findOne({ $or: [{ email: loginId }, { username: loginId }] })
        if (!user)
            return res.status(404).json({ success: false, message: "invalid credentials" })

        const match = await bcryptjs.compare(password, user.password)
        if (!match)
            return res.status(400).json({ success: false, message: "invalid credentials" })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' })
        res.cookie('token', token, options).json({ success: true, message: "login successful", user, token })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}