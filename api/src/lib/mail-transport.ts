import * as nodemailer from 'nodemailer';
import { ENV } from '../http/server';

export function mailTransport(): nodemailer.Transporter {
    const transport = nodemailer.createTransport({
        host: ENV.HOST_MAIL_SENDER,
        port: Number(ENV.PORT_MAIL_SENDER),
        secure: Number(ENV.PORT_MAIL_SENDER) === 465, // true para 465, false para outros
        auth: {
            user: ENV.USER_MAIL_SENDER,
            pass: ENV.PASS_MAIL_SENDER,
        },
    });
    return transport;
}
