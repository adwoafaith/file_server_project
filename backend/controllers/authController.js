const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const sendEmail = require('../utils/email')
const businessDistribution = require("../models/file");
const { genToken, verifyToken } = require("../utils/access-token");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config()
//handle errors
const handleErrors = (err) => {
    let errors = { email: "", password: "" };

    //handeling duplicate error code
    if (err.code === 11000)
        return { message: "That email is already registered" };

    //validation errors
    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return { message: errors.password };
};

//registration function
const signup_post = async (req, res, next) => {
    const { email, password, role } = req.body;
    try {
        const user = await User.create({ email, role, password });
        res.status(201).json({ message: "Registered sucessfully" });
    } catch (err) {
        res.status(400).json({ ...handleErrors(err) });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //checking if user provided username and password
        const notUser = !email || !password;
        if (notUser) {
            return res.status(400).json({
                message: "username or password not present",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "login not successful",
                error: "user not found",
            });
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return next(err);
                if (result) {
                    let token = genToken({ email, role: user.role });
                    return res.status(200).json({
                        message: "login Successful",
                        token,
                        role: user.role
                    });
                } else {
                    return res.status(400).json({
                        message: "Login not successfull",
                    });
                }
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occured",
            error: error.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        //generate a unique token
        const token = crypto.randomBytes(20).toString("hex");

        //find the user by their email
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User is not found" });
        }
        //store token and generate tokenexpires in user records
        user.passwordResetToken = token;
        user.passwordResetTokenExpires = Date.now() + 3600000;
        await user.save();

        const mail_name = process.env.USER_NAME;
        const password = process.env.APP_PASSWORD;

        //transporter create a transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: mail_name,
                pass: password,
            },
        });
        //email options
        const mailOptions = {
            from: mail_name,
            to: user.email,
            subject: "Reset password",
            text:
                `You or someone send a request to change your email password` +
                `ignore of not necessary or click on the link below to reset your password:\n\n` +
                `${FRONTEND_URL}/resetPassword/${token}\n\n`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res
                    .status(500)
                    .json({ sucess: false, message: "Email not send! Failed" });
            }
            return res
                .status(200)
                .json({
                    sucess: true,
                    token: token,
                    message: "Password link sent to the email provided",
                });
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        //find user by toke and the duration the token expires
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(400)
                .json({ message: "token is invalid or has expired" });
        }

        //reseting the password
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();

        return res
            .status(200)
            .json({ sucess: true, message: "Password reset sucessful" });
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error.message,
        });
    }
};

module.exports = {
    login,
    signup_post,
    forgotPassword,
    resetPassword,
};
