const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({ email: req.body.email })

    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // token generation, passwords the same
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate.id
            }, keys.jwt, { expiresIn: 60 * 60 })
            res.status(200).json({ token: `Bearer ${token}` })
        } else {
            res.status(401).json({
                message: 'password wrong! try again'
            })
        }
    } else {
        res.status(404).json({
            message: 'user not found!'
        })
    }
}

module.exports.register = async function (req, res) {

    const candidate = await User.findOne({ email: req.body.email })
    if (candidate) {
        //user exists
        res.status(409).json({
            message: 'user with such email exists'
        })
    } else {
        // user not exists
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
            
        })
        console.log('user added')
        try {
            await user.save()
            res.status(201).json(user)
        }
        catch (error) {
errorHandler(res.e)
        }

    }
}