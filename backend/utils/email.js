const nodemailer = require('nodemailer')

const sendEmail = async(option) =>{
    //transporter
    const transporter = nodemailer.createTransport({
       host: process.env.EMAIL_HOST,
       port: process.env.EMAIL_PORT,
       auth:{
        user:process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD
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
