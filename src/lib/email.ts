import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || 'EndaTech <info@endatech.nl>';
const adminEmail = process.env.ADMIN_EMAIL || 'info@endatech.nl';
const baseUrl = process.env.NEXTAUTH_URL || 'https://www.endatech.nl';

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#1e3a5f;font-size:24px;margin:0;">EndaTech</h1>
        <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Airconditioning & Klimaattechniek</p>
      </div>
      ${content}
    </div>
    <div style="text-align:center;padding:16px;color:#94a3b8;font-size:12px;">
      <p style="margin:0;">EndaTech B.V. &mdash; info@endatech.nl</p>
      <p style="margin:4px 0 0;">Dit is een automatisch gegenereerd bericht.</p>
    </div>
  </div>
</body>
</html>`;
}

function button(url: string, text: string): string {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${url}" style="background:#1e3a5f;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">${text}</a>
  </div>`;
}

// ── Email 1: Bevestiging naar klant na offerte-aanvraag ──

export async function sendQuoteRequestConfirmation(to: string, data: {
  name: string;
  quoteNumber: string;
}) {
  const html = layout(`
    <h2 style="color:#1e3a5f;font-size:20px;">Bedankt voor uw aanvraag, ${data.name}!</h2>
    <p style="color:#334155;line-height:1.6;">
      Wij hebben uw offerte-aanvraag in goede orde ontvangen. Uw offertenummer is:
    </p>
    <div style="background:#f0f9ff;border:2px solid #1e3a5f;border-radius:8px;padding:16px;text-align:center;margin:16px 0;">
      <span style="font-size:24px;font-weight:bold;color:#1e3a5f;letter-spacing:2px;">${data.quoteNumber}</span>
    </div>
    <p style="color:#334155;line-height:1.6;">
      <strong>Bewaar dit nummer goed!</strong> U heeft dit nodig om uw offerte later te bekijken en te ondertekenen.
    </p>
    <p style="color:#334155;line-height:1.6;">
      Wij nemen uw aanvraag zo snel mogelijk in behandeling. U ontvangt een e-mail zodra uw offerte klaar is.
    </p>
    <p style="color:#64748b;font-size:14px;margin-top:24px;">
      Heeft u vragen? Neem gerust contact met ons op via <a href="mailto:info@endatech.nl" style="color:#1e3a5f;">info@endatech.nl</a>.
    </p>
  `);

  await transporter.sendMail({
    from,
    to,
    subject: `Offerte-aanvraag ontvangen — ${data.quoteNumber}`,
    html,
  });
}

// ── Email 2: Notificatie naar admin bij nieuwe aanvraag ──

export async function sendAdminNewQuoteNotification(data: {
  quoteNumber: string;
  name: string;
  city: string;
  propertyType: string;
  rooms: string;
  phone: string;
}) {
  const html = layout(`
    <h2 style="color:#1e3a5f;font-size:20px;">Nieuwe offerte-aanvraag</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Offertenummer</td><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${data.quoteNumber}</td></tr>
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Klant</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${data.name}</td></tr>
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Stad</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${data.city}</td></tr>
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Telefoon</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${data.phone}</td></tr>
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Woningtype</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${data.propertyType}</td></tr>
      <tr><td style="padding:8px;color:#64748b;">Ruimtes</td><td style="padding:8px;">${data.rooms}</td></tr>
    </table>
    ${button(`${baseUrl}/admin/quotes/${data.quoteNumber}`, 'Offerte bekijken in admin')}
  `);

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `Nieuwe aanvraag: ${data.quoteNumber} — ${data.name}, ${data.city}`,
    html,
  });
}

// ── Email 3: Offerte klaar voor klant (status → SENT) ──

export async function sendQuoteReadyNotification(to: string, data: {
  name: string;
  quoteNumber: string;
}) {
  const html = layout(`
    <h2 style="color:#1e3a5f;font-size:20px;">Uw offerte is klaar, ${data.name}!</h2>
    <p style="color:#334155;line-height:1.6;">
      Goed nieuws! Uw offerte <strong>${data.quoteNumber}</strong> is opgesteld en klaar om te bekijken.
    </p>
    <p style="color:#334155;line-height:1.6;">
      Klik op de onderstaande knop om uw offerte te bekijken. U heeft uw offertenummer en telefoonnummer nodig.
    </p>
    ${button(`${baseUrl}/offerte-bekijken`, 'Offerte bekijken')}
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#334155;font-size:14px;">
        <strong>Uw offertenummer:</strong> ${data.quoteNumber}
      </p>
    </div>
    <p style="color:#64748b;font-size:14px;margin-top:24px;">
      Heeft u vragen over de offerte? Neem gerust contact met ons op via <a href="mailto:info@endatech.nl" style="color:#1e3a5f;">info@endatech.nl</a>.
    </p>
  `);

  await transporter.sendMail({
    from,
    to,
    subject: `Uw offerte ${data.quoteNumber} is klaar — EndaTech`,
    html,
  });
}

// ── Email 4: Admin notificatie bij ondertekening ──

export async function sendAdminSignatureNotification(data: {
  quoteNumber: string;
  name: string;
  signedAt: string;
}) {
  const html = layout(`
    <h2 style="color:#1e3a5f;font-size:20px;">Offerte ondertekend!</h2>
    <p style="color:#334155;line-height:1.6;">
      Klant <strong>${data.name}</strong> heeft offerte <strong>${data.quoteNumber}</strong> digitaal ondertekend.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Offertenummer</td><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${data.quoteNumber}</td></tr>
      <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #e2e8f0;">Klant</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${data.name}</td></tr>
      <tr><td style="padding:8px;color:#64748b;">Ondertekend op</td><td style="padding:8px;">${data.signedAt}</td></tr>
    </table>
    ${button(`${baseUrl}/admin/quotes/${data.quoteNumber}`, 'Bekijk handtekening')}
    <p style="color:#334155;line-height:1.6;">
      U kunt de status nu wijzigen naar <strong>ACCEPTED</strong> om het werk in te plannen.
    </p>
  `);

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `Ondertekend: ${data.quoteNumber} — ${data.name}`,
    html,
  });
}
