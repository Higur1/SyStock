import * as nodemailer from 'nodemailer'
import { templateHtml } from './template';

export const transport = nodemailer.createTransport({
//    service: "gmail",
    host:"smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export function sendEmail(email, token, instance){
    transport.sendMail({
        from: process.env.EMAIL,
        to:email,
        subject: "Solicitação de reinicio de senha",
        text:"",
        html: templateHtml(token, instance)
    }).then(result =>{
        return result;
    }).catch(error =>{
        return error;
    })
}
