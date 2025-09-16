import type { Address } from 'nodemailer/lib/mailer';
import { Options } from 'nodemailer/lib/mailer';
import { env } from 'src/http/server';
import { mailTransport } from 'src/lib/mail-transport';


export type MailSenderSchema = {
    from?: Address;
    recipients: Address[];
    subject: string;
    html: string;
    text?: string;
    placeholderReplacements?: Record<string, string>;
};

export async function SendEmail({ from, recipients, subject, html }: MailSenderSchema) {
    const transport = mailTransport();

    const options: Options = {
        from: from ?? {
            name: env.data.APP_NAME,
            address: env.data.ADDRESS_MAIL_SENDER,
        },
        to: recipients,
        subject,
        html,
    };

    try {
        const result = await transport.sendMail(options);

        return result;
    } catch (error) {
        console.log(error);
    }
}
