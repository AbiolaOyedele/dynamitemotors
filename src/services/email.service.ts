import { resendClient } from '@/lib/resend'
import { AppError } from '@/lib/errors'
import type { QuoteFormData } from '@/types/quote.types'

export async function sendQuoteEmail(data: QuoteFormData): Promise<void> {
  const { error } = await resendClient.emails.send({
    from: 'Dynamite Motors Website <onboarding@resend.dev>',
    to: 'dynamitemotor@gmail.com',
    replyTo: data.email,
    subject: `New Quote Request — ${data.service}`,
    html: buildEmailHtml(data),
  })

  if (error) {
    throw new AppError(500, 'Failed to send quote email.', 'EMAIL_SEND_FAILED')
  }
}

function buildEmailHtml(data: QuoteFormData): string {
  const { name, email, phone, service, message } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Quote Request</title>
      </head>
      <body style="margin:0;padding:0;background:#F5F5F5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background:#1ED760;padding:32px 40px;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                      DYNAMITE MOTORS
                    </h1>
                    <p style="margin:8px 0 0;color:#d5ffd5;font-size:14px;">New Quote Request</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="margin:0 0 24px;color:#333333;font-size:16px;line-height:1.6;">
                      A new quote enquiry has been submitted via the website.
                    </p>

                    <!-- Details table -->
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="border:1px solid #E8E8E8;border-radius:6px;overflow:hidden;">
                      ${row('Name', name)}
                      ${row('Email', `<a href="mailto:${email}" style="color:#1ED760;">${email}</a>`)}
                      ${row('Phone', `<a href="tel:${phone}" style="color:#1ED760;">${phone}</a>`)}
                      ${row('Service', service)}
                      ${message ? row('Message', escapeHtml(message)) : ''}
                    </table>

                    <!-- Reply CTA -->
                    <p style="margin:32px 0 0;color:#666666;font-size:14px;line-height:1.6;">
                      Reply directly to this email to respond to ${escapeHtml(name)} —
                      your reply will go to <strong>${email}</strong>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#F5F5F5;padding:24px 40px;border-top:1px solid #E8E8E8;">
                    <p style="margin:0;color:#666666;font-size:13px;">
                      Dynamite Motors · 2 Vale Rd, Northfleet, Gravesend DA11 9RE
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:14px 20px;background:#F5F5F5;border-bottom:1px solid #E8E8E8;
                 font-size:13px;font-weight:600;color:#666666;width:140px;white-space:nowrap;">
        ${label}
      </td>
      <td style="padding:14px 20px;border-bottom:1px solid #E8E8E8;
                 font-size:15px;color:#1a1a1a;line-height:1.5;">
        ${value}
      </td>
    </tr>
  `
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
