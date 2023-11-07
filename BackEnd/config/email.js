const nodemailer = require('nodemailer');
const {database} = require("./helpers");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'amaraganisaikiran1999@gmail.com',
        pass: 'dngorfotbmzzfldb'
    }
});

function RegisterEmail(email) {

    const mailOptions = {
        from: '"ASAP Admin" <amaraganisaikiran1999@gmail.com>',
        to: email,
        subject: 'Confirmation: your account has been created',
        html: "<h1>Dear User,</h1>" +
            "<p>Thank you for signing up for ASAP Application</p>" +
            "<p>We’d like to confirm that your account was created successfully</p>" +
            "<p>Best,</p>" +
            "<p>The ASAP team</p>"
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function ContactEmail(email, message) {
    const mailOptions = {
        from: '"Support" <amaraganisaikiran1999@gmail.com>',
        to: email,
        subject: message,
        html: "<h1>Dear Customer,</h1>" +
            "<p>Thank you for contacting us</p>" +
            "<p>We acknowledge receipt of your email. One of our care adviser will respond to you shortly with an update</p>" +
            "<p>Sincerely,</p>" +
            "<p>ASAP Support team</p>"
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function OrderEmail(userId, products, orderId) {

    let userDetails = await database.table('users')
        .filter({id: userId})
        .withFields(['email', 'username'])
        .get().then(user => {
            return user;
        })

    let ids = [];
    products.forEach(ele => {
        ids.push(ele);
    })


    const mailOptions = {
        from: '"ASAP.in" <amaraganisaikiran1999@gmail.com>',
        to: userDetails.email,
        subject: `Your ASAP.in order #${orderId} of ${ids.length} items`,
        text: `Hello ${userDetails.username},\r\n \r\n` +
            `Thank you for your order\r\n \r\n` +
            `Order summary\r\n` +
            `-------------------------\r\n` +
            `Order #${orderId}\r\n \r\n` +
            `Placed on ${new Date().toLocaleDateString('en-us', {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            })}\r\n \r\n` +
            `We hope to see you again soon.\r\n` +
            `ASAP.in`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { RegisterEmail, ContactEmail, OrderEmail };
