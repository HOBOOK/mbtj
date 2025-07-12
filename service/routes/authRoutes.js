const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const express = require('express');
const router = express.Router();

const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID')

router.post('/google', async (req, res) => {
  const { token } = req.body
  try {
    // 1. Google 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: 'YOUR_GOOGLE_CLIENT_ID'
    })
    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    // 2. 사용자 DB 확인
    let user = await User.findOne({ email })

    // 3. 없으면 자동 회원가입
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        provider: 'google'
      })
    }

    // 4. JWT 발급
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      'your_jwt_secret',
      { expiresIn: '7d' }
    )

    res.json({ token: jwtToken, user })
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token' })
  }
})
