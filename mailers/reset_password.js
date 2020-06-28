const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.resetPassword = (user,token) => {
    console.log('inside newComment mailer', user);

    nodeMailer.transporter.sendMail({
       from: 'atulsid156@gmail.com',
       to: user.email,
       subject: "RESET PASSWORD",
       html: `<h1>Reset Link1>
         
         <a  href="http://localhost:8000/users/set-password/${user.id}/${token}">Click Here</a>
       `
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}