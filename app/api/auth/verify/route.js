
async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ success: false, message: 'invalid id' })
        console.log(email)
        let user = await User.findOne({ email })
        console.log(user)
        if (user.isVerified) {
            return res.json({ success: true, message: 'account already verified' })
        }
        user.isVerified = true
        await user.save()
        return res.json({ success: true, message: 'Account Verified Successfully', user })
    } catch (error) {
        return res.json({ message: error.message, success: false })
    }
}