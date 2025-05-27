import nodemailer from 'nodemailer';

export async function POST(request) {
  const { name, email, rating, message } = await request.json();

  // Configure your SMTP transporter (use environment variables in production)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    auth: {
      user: process.env.SMTP_USER || 'alexandrea.kuvalis72@ethereal.email',
      pass: process.env.SMTP_PASS || 'busJwusYnmsz3exP9r',
    },
  });

  // Email content
  const mailOptions = {
    from: 'no-reply@bibliotheca.com',
    to: email,
    subject: 'Thank you for your review!',
    text: `Hi ${name},\n\nThank you for your review!\n\nYour Rating: ${rating}\nYour Message: ${message}\n\nWe appreciate your feedback.\n\nBest regards,\nBibliotheca Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 