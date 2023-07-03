const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../emailTransporter/email')
const businessDistribution = require('../models/file')
const { genToken } = require('../utils/access-token')

//handle errors
const handleErrors = (err) => {
    // console.log('heelo', err.message, err.code)
    let errors = { email: '', password: '' };
    
    //handeling duplicate error code
    if (err.code === 11000) return { message: 'That email is already registered' }

    //validation errors   
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return {message: errors.password};
}

//registration function
const signup_post = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        res.status(201).json({ message: 'Registered sucessfully' });
    }
    catch (err) {
        res.status(400).json({ ...handleErrors(err) })
    }

}

const login = async (req, res, next) => {
    let { email, password } = req.body;
    //checking if user provided username and password
    if (!email || !password) {
        return res.status(400).json({
            message: "username or password not present"
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "login not successful",
                error: "user not found"
            });
        } else {
            //compare given password to hashed password
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    let token = genToken({email,  role:user.role})
                    return res.status(200).json({
                        message: "login Successful",
                        token              
                    });
                }
                else {
                    return res.status(400).json({
                        message: "Login not successfull"
                    });
                }

            })
        }

    }
    catch (error) {
        res.status(400).json({
            message: "An error occured",
            error: error.message
        })
    }
}




const signup_get = (req, res) => {
    res.render('signup');
}
const login_get = (req, res) => {
    res.render('Login')
}
const login_post = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)

}


module.exports =
{
    login,
    signup_get,
    login_get,
    signup_post,
    login_post
}