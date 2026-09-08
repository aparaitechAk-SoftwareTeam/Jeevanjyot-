const nodemailer = require("nodemailer");

const parseEmailAddress = (rawFrom) => {
  if (!rawFrom) return { name: "Jeevanjyot Clinic", email: "noreply@jeevanjyot.com" };
  const match = rawFrom.match(/(?:"?([^"]*)"?\s*)?<?([^>]+)>?/);
  if (match && match[2]) {
    return {
      name: match[1]?.trim() || "Jeevanjyot Clinic",
      email: match[2]?.trim() || rawFrom.trim(),
    };
  }
  return { name: "Jeevanjyot Clinic", email: rawFrom.trim() };
};

const isEmailConfigured = () => {
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  const brevoConfigured = Boolean(process.env.BREVO_API_KEY || process.env.SIB_API_KEY);
  return smtpConfigured || brevoConfigured;
};

const sendGenericEmail = async ({ to, subject, html, text }) => {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY || process.env.SIB_API_KEY;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = process.env.SMTP_PORT || 587;
    const rawFrom =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      process.env.ADMIN_EMAIL ||
      "noreply@jeevanjyot.com";

    const parsedFrom = parseEmailAddress(rawFrom);
    let brevoError = null;

    // 1. Try Brevo HTTP API
    if (brevoApiKey) {
      try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: { name: parsedFrom.name, email: parsedFrom.email },
            to: [{ email: to }],
            subject,
            htmlContent: html || undefined,
            textContent: text || undefined,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          return { success: true, provider: "brevo_api", messageId: resData.messageId };
        } else {
          brevoError = await response.json();
          console.warn("Brevo API delivery failed, attempting SMTP fallback:", brevoError);
        }
      } catch (apiErr) {
        brevoError = apiErr.message;
        console.warn("Brevo API fetch error, attempting SMTP fallback:", apiErr.message);
      }
    }

    // 2. Fallback to SMTP via Nodemailer
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${parsedFrom.name}" <${parsedFrom.email}>`,
        to,
        subject,
        html,
        text,
      });

      return { success: true, provider: "smtp", messageId: info.messageId };
    }

    return {
      success: false,
      error: brevoError || "No functional email service provider configured.",
    };
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, error: err.message };
  }
};

const sendPasswordResetEmail = async ({ to, adminName, resetUrl }) => {
  const subject = "Jeevanjyot Admin Password Reset";
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F7F3E8; margin: 0; padding: 20px; color: #17231C; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(18,60,42,0.1); }
        .header { background-color: #123C2A; padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; font-family: Georgia, serif; }
        .header p { margin: 5px 0 0 0; color: #C5A45D; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
        .body { padding: 30px; }
        .btn { display: inline-block; background-color: #123C2A; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; margin: 20px 0; text-align: center; }
        .footer { padding: 20px 30px; background-color: #FAFBF9; border-top: 1px solid #EAEAEA; font-size: 12px; color: #66736B; text-align: center; }
        .warning { background-color: #FFFDF5; border: 1px solid #F5E6BE; padding: 12px 16px; border-radius: 10px; font-size: 12px; color: #8A6D3B; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>Jeevanjyot Clinic</p>
          <h1>Admin Password Reset</h1>
        </div>
        <div class="body">
          <p>Hello ${adminName || "Admin"},</p>
          <p>We received a request to reset your password for the Jeevanjyot Admin Portal.</p>
          <p>Click the button below to set a new password. This link is valid for <strong>20 minutes</strong>.</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Admin Password</a>
          </div>
          <p style="font-size: 12px; color: #66736B;">If the button does not work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; word-break: break-all; color: #123C2A;">${resetUrl}</p>
          <div class="warning">
            ⚠️ If you did not request a password reset, please ignore this email or contact support immediately. Your password will remain unchanged.
          </div>
        </div>
        <div class="footer">
          © Jeevanjyot Nature Cure Ayurvedic Clinic & Panchakarma Centre. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendGenericEmail({ to, subject, html: htmlContent });
};

module.exports = { isEmailConfigured, sendGenericEmail, sendPasswordResetEmail };

