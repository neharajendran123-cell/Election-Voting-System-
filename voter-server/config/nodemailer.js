import nodemailer from 'nodemailer';

// Create a transporter using your email service provider's settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service provider, here it's Gmail
  auth: {
    user: 'neharajendran123@gmail.com', // Replace with your email
    pass: 'fykl phtt zqjo deor',  // Replace with your email password (use app password for Gmail)
  },
});

// Export the transporter to use it in other files
export default transporter;
