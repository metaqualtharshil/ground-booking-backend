const nodemailer=require('nodemailer');

const sendEmail = async options =>{
    //1) create a transporter
    const trasporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2) define the email option
    const mailOption = {
        from : 'devhem241@gmail.com',
        to: options.email,
        text: options.message,
        subject: options.subject,
    }
    // 3) Actually send the email

    await trasporter.sendMail(mailOption);
};

module.exports = sendEmail;