const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: 'digithousing@gmail.com',
        pass: 'digithousing@123',
    },
    tls: {
        rejectUnauthorized: false
    }
});

// exports.sendEmail = async (to, subject, text, message) => {
//     transporter.sendMail({
//         from: '"Digit House" <digithousing@gmail.com>', // sender address
//         to, // list of receivers
//         subject,
//         text, // plain text body
//         html: `${message}`, // html body
//     }).then(info => {
//         console.log({ info });
//         return info;
//     }).catch(console.error);
   
// }

exports.sendEmail = async (to, subject, text, message) => {
    transporter.sendMail({
        from: '"Reminder" <digithousing@gmail.com>', // sender address
        to, // list of receivers
        subject,
        text, // plain text body
        html: `${message}`, // html body
    }).then(info => {
        console.log({ info });
        return info;
    }).catch(console.error);
   
}

