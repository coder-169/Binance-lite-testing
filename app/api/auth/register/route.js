async (req, res) => {

    console.log(req.body)
    try {
        let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }, { phone: req.body.phone }] })
        if (user?.isVerified) {
            return res.status(400).json({ success: false, message: 'try different credentials' })
        }
        let code = generateCode()
        const { username, email, phone, password } = req.body
        if (!user) {
            const hashedPass = await bcryptjs.hash(password, 10)
            user = await User.create({ username, email, phone, password: hashedPass })
        }
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: `Account Verification Code`,
            text: `Hi ${user.username}, \n\n Your account is created you have to verify by entering this ${code} code (it will expire in 10 minutes) and then you can login with your credentials`,
        };

        await sendEmail(req, res, mailOptions);
        return res.json({ success: true, code, message: `We've sent you an email, please verify your account.` })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// GEt
export const resendCode =  async (req, res) => {
    try {
        // const { email } = req. // from req.headers
        if (!email)
            return res.json({ success: false, message: 'invalid email' })
        const user = await User.findOne({ email });
        if (!user)
            return res.json({ success: false, message: 'user not found' })
        let code = generateCode()
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            // to: 'info@mawsool.tech',
            subject: `Account Verification Code`,
            text: `Hi ${user.firstName}, \n\n Your account is created you have to verify by entering this ${code} code (it will expire in 10 minutes) and then you can login with your credentials`,
        }
        sendEmail(req, res, mailOptions)
        return res.json({ success: true, message: 'Email Resend Successful', code })
    } catch (error) {
        return res.json({ success: true, message: error.message })
    }
}