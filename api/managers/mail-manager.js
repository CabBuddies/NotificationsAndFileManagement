const nodemailer = require("nodemailer");

var transporter = undefined;

async function loadTransporter(){
    if(transporter===undefined)
        transporter = nodemailer.createTransport({
            host: "mail.nihalkonda.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'cabbuddies@nihalkonda.com', // generated ethereal user
              pass: 'ikmvCab.123' // generated ethereal password
            }
        });
}

async function sendMail(to,subject,html) {
    await loadTransporter()
  
    let data = {
        from: '"CabBuddies 🚕👫" <cabbuddies@nihalkonda.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
      };

      console.log(data)

    let info = await transporter.sendMail(data);
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  module.exports={sendMail}