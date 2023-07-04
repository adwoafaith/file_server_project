const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/email')
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
const forgotPassword = async(req, res, next) =>{
     //getting the user based on the provided email
     const {email} = req.body;
     const user = await User.findOne({email})
     if (!user){
        return res.status(404).json({
            message: "No user exists with email"
        })
     }
     //generate a random reset token
     const resetToken = user.createResetPasswordToken();
     await user.save({validateBeforeSave:false});
     //send the token to the user email
     const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
     const message = `we have received a password request.Use the below link to reset password \n\n${resetUrl}\n\n link is available for only 10 minute`;
     try{
    
         await sendEmail({
            email:user.email,
            subject:'Password change request received',
            message:message
         });
         res.status(200).json({status:'success',
         message:`Password reset link send to the user email`})
     }
     catch(error){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined
        user.save({validateBeforeSave:false});
    
        res.status(500).json({message:`There was an error sending password reset email.Please try again later`,error:error.message})
     }
      
    }
    console.log(sendEmail)
    
    const resetPassword = async(req,res, next) => {
    
    }
    
    const restrict = async(role) =>{
        //sellect the user based on the password reset token
        //User.findOne(())
        return (req, res, next)
         
    }


module.exports =
{
    login,
    signup_post,
    forgotPassword,
    resetPassword

    }