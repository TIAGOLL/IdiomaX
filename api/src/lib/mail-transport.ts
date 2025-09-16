import * as nodemailer from 'nodemailer';
import { env } from 'src/http/server';

export function mailTransport(): nodemailer.Transporter {
    const transport = nodemailer.createTransport({
        host: env.data.HOST_MAIL_SENDER,
        port: Number(env.data.PORT_MAIL_SENDER),
        secure: Number(env.data.PORT_MAIL_SENDER) === 465, // true para 465, false para outros
        auth: {
            user: env.data.USER_MAIL_SENDER,
            pass: env.data.PASS_MAIL_SENDER,
        },
    });
    return transport;
}
