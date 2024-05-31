import axios from 'axios';
import express, { text } from 'express';
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());

// Handle files with multer
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.json({ message: "Survey Mailer API Service" });
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log("=== Service running on port: " + process.env.LISTEN_PORT + " ===");
});

let transporter = createTransport({
  host: process.env.HOST,
  secureConnection: process.env.SECURE === 'true',
  port: parseInt(process.env.PORT, 10),
  tls: {
    ciphers: process.env.CIPHERS,
    rejectUnauthorized: process.env.REJECT === 'true',
    minVersion: process.env.MIN_VERSION,
    maxVersion: process.env.MAX_VERSION
  },
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  debug: true,
  logger: true
});

// async function checkServerStatus() {
//   try {
//     await axios.get(process.env.SERVER_URL);
//   } catch (error) {
//     console.error("=== Server is down ===", error);
//     sendEmailNotification();
//   }
// };

// function sendEmailNotification() {
//   let mailOptions = {
//     from: process.env.EMAIL,
//     to: 'ryder.cook@gomaps.com',
//     subject: 'Survey Mail API Service Down!',
//     text: `Your api service is down. Please check the server where your service is running.`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("=== Error while sending service down email notification ===", error);
//     } else {
//       console.log("=== Service down email notification sent successfully ===", info.response);
//     }
//   });
// };

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("=== Service is ready to take messages ===");
  }
});

// Handle email sending with attachment
app.post('/send', upload.single('file'), (req, res) => {
  console.log("=== Received request for sending email ===");

  let mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: req.body.subject,
    text: `New submission for store: ${req.body.text}` 
        + `\n\n` + `Attached is the PDF with the survey results.`
        + `\n\n` + `Please check the attachment for more details.`
        + `\n` + `Regards,`
        + `\n` + `Mid-American Point Of Sale`,
    attachments: [{
      filename: req.file.originalname,
      path: req.file.path,
      contentType: req.file.mimetype,
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // Clean up: remove file after sending the email
    fs.unlinkSync(req.file.path);

    if (error) {
      console.log("=== Error while sending email ===", error);
      return res.status(500).json({ error: "Internal Server Error!" });
    }
    console.log("=== Email sent successfully ===", info.response);
    return res.status(200).json({ message: "Email sent successfully!" });
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  let mailOptions = {
    from: process.env.EMAIL,
    to: 'ryder.cook@gomaps.com',
    subject: 'Error in Survey Mailer API',
    text: `An error occurred in the API: \n\n${err.stack}`
  };

  // Send email to the admin
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("=== Error while sending error notification email ===", error);
    } else {
      console.log("=== Error notification email sent successfully ===", info.response);
    }
  });

  // Send error response to the client
  res.status(500).send('An error occurred, administrators have been notified!');
});

// Check server status every 30 minutes
// setInterval(checkServerStatus, 1 * 60 * 1000);