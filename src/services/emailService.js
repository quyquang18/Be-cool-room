require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail =async(dataSend)=>{
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Noname 👻" <quyquanght18@gmail.com>', // sender address
        to: dataSend.receiverEmail , // list of receivers
        subject: "Verify Email ✔", // Subject line
        html: `
        <div style="background-color:#eeebeb;padding:2px 22px 32px">
        <h3 style="font-size:32px;font-weight:600;color:#000;text-align:center">Hello ${dataSend.firstname}</h3>
        <p style="font-size:20px;text-align:left;padding:0 75px">Chúc mừng bạn đã đăng ký tài khoản thành công. Hãy kích hoạt trong vòng 24h để sử dụng tài khoản </p>
        <div>
          <br> <strong>Thông tin đăng nhập:</strong>
          <br>Tên đăng nhập : ${dataSend.username}<br>
          Mật khẩu : không hiển thị vì lý do bảo mật<br>
        </div>
        <div style="color:black;background-color:#f47346;font-weight:700;font-size:18px;padding:12px 22px;text-align:center;margin:12px 60px"> 
        <p>Click <a href=${dataSend.url}>vào đây</a> để xác nhận</p>
        </div>
        <div>Nếu bạn không phải bạn vui lòng bỏ qua Email này</div>
        <div style
        ="margin:22px 0">Xin trân trọng cảm ơn.</div>
        
        </div> `, // html body
      });
      console.log(info)
}
let sendEmailWarning =async(dataSend)=>{
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Noname 👻" <noreply@example.com>', // sender address
      to: dataSend.receiverEmail , // list of receivers
      subject: `Warning ${dataSend.type} !`, // Subject line
      html: `
      <div style="background-color:#eeebeb;padding:2px 22px 32px">
      <h3 style="font-size:32px;font-weight:600;color:#000;text-align:center">Hello ${dataSend.firstname}</h3>
      <p style="font-size:20px;text-align:left;padding:0 75px">Warning system </p>
      <div>
        <br> <strong>Thông tin chi tiết:</strong>
        <br>Day-Month-Year : ${dataSend.date}
        <br>Time : ${dataSend.time}
        <br>${dataSend.type} : ${dataSend.value}<br>
      </div>
      <br>
      <br>
      <div>Please check the devices again</div>
      <div style="margin:22px 0">Thank you very much.</div>
      </div>
      </div> `, // html body
    });
}

module.exports ={
    sendSimpleEmail:sendSimpleEmail,
    sendEmailWarning:sendEmailWarning,
}