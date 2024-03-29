// // import nodemailer from 'nodemailer';

// // export const sendEmail = async (email: string, subject: string, text: string, attachments: any) => {
// //   const transporter = nodemailer.createTransport({
// //     host: "smtp.office365.com",
// //     port: 587,
// //     secure: true,
// //     auth: {
// //         user: "2016.User@gomaps.com",
// //         pass: "SD!6639193"
// //     }
// //   });

// //   // Mail Options
// //   const mailOptions = {
// //     from: "MapsFedExTrackingService@gomaps.com",
// //     to: email,
// //     subject: subject,
// //     text: text,
// //     attachments: [
// //         {
// //             filename: "aotsfees.pdf",
// //             content: attachments,
// //             contentType: "application/pdf"
// //         }
// //     ]
// //   };

// //   // Send Mail
// //   transporter.sendMail(mailOptions, (error, info) => {
// //     if (error) {
// //         console.error('Error sending email: '+ error.message || JSON.stringify(error));
// //     } else {
// //         console.log('Email sent successfully: ' + info.response);
// //     }
// //   });
// // };

// // SMTP Connection 
// import nodemailer from 'nodemailer/lib/smtp-connection';
// import { Mailer } from 'nodemailer-react';
// import Mail from 'nodemailer/lib/mailer';

// export const sendEmail = async (email: string, subject: string, text: string, attachments: any) => {
//     // SMTP Connection
//     const mailerConfig = {
//         transport: {
//             host: "smtp.office365.com",
//             port: 587,
//             secure: true,
//             auth: {
//                 user: "2016.User@gomaps.com",
//                 pass: "SD!6639193"
//             }
//         }
//     };

//     // Mail Options
//     const mailOptions = {
//         from: "MapsFedExTrackingService@gomaps.com",
//         to: email,
//         subject: subject,
//         text: text,
//         attachments: [
//             {
//                 filename: "aotsfees.pdf",
//                 content: attachments,
//                 contentType: "application/pdf"
//             }
//         ]
//     };

//     // Create Mailer
//     const emailsList = {
//         email: mailOptions
//     };

//     // Mailer to Export
//     const mailer = Mailer(mailerConfig, emailsList);
// };