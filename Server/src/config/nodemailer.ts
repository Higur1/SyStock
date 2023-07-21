import * as nodemailer from 'nodemailer'
import ip from "ip";
import { templateHtml } from '../template';

export const transport = nodemailer.createTransport({
    service: "gmail",
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: "jvxjybguyzjyzdxy"
    }
});

export function sendEmail(email, token, instance){
    transport.sendMail({
        from: process.env.EMAIL,
        to:email,
        subject: "Solicitação de reinicio de senha",
        html: templateHtml(token.value, instance)
    }).then(result =>{
        console.log(result);
        return result;
    }).catch(error =>{
        console.log(error);
        return error;
    })
}
