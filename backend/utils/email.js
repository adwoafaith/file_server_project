const nodemailer = require('nodemailer')

const user = process.env.USER
const password =  process.env.APP_PASSWORD
const sendEmail = async(option) =>{
    //transporter
    const transporter = nodemailer.createTransport({
       service: "Gmail",
       auth:{
        user:user,
        pass: password
       }
    })
    //email options
    const emailOptions = {
        from: 'Adwoa support<support@adwoa.com>',
        to: option.email,
        subject:option.subject,
        text: option.message
    }
    await transporter.sendMail(emailOptions);
}

module.exports =  sendEmail
