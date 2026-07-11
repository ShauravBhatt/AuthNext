import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export default async function sendEmail(options : {
  email: string,
  subject: string,
  mailgenContent: Mailgen.Content,
}) {
  if (options.email.trim().length === 0 || options.subject.trim().length === 0 || !options.mailgenContent) {
    throw new Error("Invalid input for email");
  }

  const mailgen = new Mailgen({
    theme: {
      path: process.cwd() + '/node_modules/mailgen/themes/default/index.html',
      plaintextPath: process.cwd() + '/node_modules/mailgen/themes/default/index.txt'
    },
    product: {
      name: "AuthNext",
      link: "https://github.com/ShauravBhatt/AuthNext"
    }
  })

  const htmlEmail = mailgen.generate(options.mailgenContent);
  const textEmail = mailgen.generatePlaintext(options.mailgenContent)

  const mail = {
    from: `${process.env.EMAIL_FROM} <authnext@team.email>`,
    to: `${options.email}`,
    subject: `${options.subject}`,
    text: textEmail,
    html: htmlEmail,
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USERNAME,
      pass: process.env.MAILTRAP_SMTP_PASSWORD,
    }
  })

  try {
    await transporter.sendMail(mail);
    console.log("Mail delivered successfully !!");
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Can't delivered the mail check mailtrap credentials. ");
  }
}
