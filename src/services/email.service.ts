import { resendClient } from '@/lib/resend'
import { AppError } from '@/lib/errors'
import { env } from '@/config/env'
import type { QuoteFormData } from '@/types/quote.types'

const FROM = 'Dynamite Motors <services@theruff.agency>'

export async function sendQuoteEmail(data: QuoteFormData): Promise<void> {
  // Send both emails in parallel — notification to garage, confirmation to customer
  const [notificationResult, confirmationResult] = await Promise.all([
    resendClient.emails.send({
      from: FROM,
      to: env.QUOTE_RECIPIENT_EMAIL,
      replyTo: data.email,
      subject: `New Quote Request: ${data.service}`,
      html: buildNotificationHtml(data),
    }),
    resendClient.emails.send({
      from: FROM,
      to: data.email,
      replyTo: 'services@theruff.agency',
      subject: `We've received your quote request, Dynamite Motors`,
      html: buildConfirmationHtml(data),
    }),
  ])

  if (notificationResult.error ?? confirmationResult.error) {
    throw new AppError(500, 'Failed to send quote email.', 'EMAIL_SEND_FAILED')
  }
}

// ── Garage notification ───────────────────────────────────────────────────────

function buildNotificationHtml(data: QuoteFormData): string {
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

                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="border:1px solid #E8E8E8;border-radius:6px;overflow:hidden;">
                      ${row('Name', escapeHtml(name))}
                      ${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:#1ED760;">${escapeHtml(email)}</a>`)}
                      ${row('Phone', `<a href="tel:${escapeHtml(phone)}" style="color:#1ED760;">${escapeHtml(phone)}</a>`)}
                      ${row('Service', escapeHtml(service))}
                      ${message ? row('Message', escapeHtml(message)) : ''}
                    </table>

                    <p style="margin:32px 0 0;color:#666666;font-size:14px;line-height:1.6;">
                      Hit Reply to respond directly to <strong>${escapeHtml(name)}</strong> at ${escapeHtml(email)}.
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

// ── Customer confirmation ─────────────────────────────────────────────────────

function getServiceBlurb(service: string): string {
  const s = service.toLowerCase()
  if (s.includes('full service') || s.includes('servicing'))
    return "We'll check your oil, filters, fluids and run through a full safety inspection so your car leaves in the best shape possible."
  if (s.includes('tyre') || s.includes('tire'))
    return "We'll check your tyre sizes, source the right fit and have you back on the road with safe, balanced rubber."
  if (s.includes('air') || s.includes('aircon') || s.includes('conditioning'))
    return "We'll regas your system, check for leaks and make sure you're getting clean, cold air whenever you need it."
  if (s.includes('brake'))
    return "We'll inspect your pads, discs and fluid and give you an honest assessment of what needs doing before any work starts."
  if (s.includes('clutch'))
    return "We'll diagnose the issue, talk you through the options and carry out the repair to get your gear changes smooth again."
  if (s.includes('engine') || s.includes('gear'))
    return "We'll run a full diagnostic, identify the fault and talk you through the repair before we touch anything."
  if (s.includes('diagnostic'))
    return "We'll scan every system on your vehicle, pull the fault codes and give you a clear picture of what's going on."
  if (s.includes('suspension'))
    return "We'll check your shocks, springs and steering components and let you know exactly what's needed for a smoother, safer ride."
  if (s.includes('exhaust'))
    return "We'll inspect the full system, advise on whether a repair or replacement is the right call and get it sorted quickly."
  if (s.includes('mot'))
    return "We'll prep your vehicle thoroughly so it goes in for its MOT in the best possible condition."
  return "We'll be in touch to confirm the details and get you booked in at a time that suits you."
}

function buildConfirmationHtml(data: QuoteFormData): string {
  const { name, service } = data
  const blurb = getServiceBlurb(service)

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Quote Request Received</title>
      </head>
      <body style="margin:0;padding:0;background:#F5F5F5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background:#111111;padding:32px 40px;">
                    <h1 style="margin:0;color:#1ED760;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                      DYNAMITE MOTORS
                    </h1>
                    <p style="margin:8px 0 0;color:#ffffff;opacity:0.6;font-size:14px;">
                      2 Vale Rd, Northfleet, Gravesend DA11 9RE
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">


                    <h2 style="margin:0 0 12px;color:#111111;font-size:22px;font-weight:700;text-align:center;">
                      We&apos;ve got your request, ${escapeHtml(name)}!
                    </h2>
                    <p style="margin:0 0 12px;color:#555555;font-size:16px;line-height:1.7;text-align:center;">
                      Thanks for reaching out about <strong>${escapeHtml(service)}</strong>.
                    </p>
                    <p style="margin:0 0 32px;color:#555555;font-size:16px;line-height:1.7;text-align:center;">
                      ${escapeHtml(blurb)}
                    </p>

                    <!-- What happens next -->
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="background:#F9F9F9;border-radius:8px;padding:0;overflow:hidden;margin-bottom:32px;">
                      <tr>
                        <td style="padding:24px 28px;">
                          <p style="margin:0 0 16px;color:#111111;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">
                            What happens next
                          </p>
                          ${step('1', 'We review your request and check availability.')}
                          ${step('2', 'We call or email you to confirm a date and time.')}
                          ${step('3', 'Bring your vehicle in, we handle the rest.')}
                        </td>
                      </tr>
                    </table>

                    <!-- Need us now -->
                    <p style="margin:0;color:#555555;font-size:15px;line-height:1.6;text-align:center;">
                      Need us sooner? Give us a call directly on<br />
                      <a href="tel:01474643488" style="color:#1ED760;font-weight:700;font-size:17px;text-decoration:none;">
                        01474 643488
                      </a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#F5F5F5;padding:24px 40px;border-top:1px solid #E8E8E8;">
                    <p style="margin:0;color:#999999;font-size:13px;text-align:center;line-height:1.6;">
                      You&apos;re receiving this because you submitted a quote request at dynamitemotors.com.<br />
                      © 2026 Dynamite Motors. All rights reserved.
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

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function step(number: string, text: string): string {
  return `
    <p style="margin:0 0 12px;color:#333333;font-size:15px;line-height:1.6;display:flex;align-items:flex-start;gap:10px;">
      <span style="display:inline-block;min-width:22px;height:22px;border-radius:50%;background:#1ED760;color:#ffffff;
                   font-size:12px;font-weight:700;text-align:center;line-height:22px;margin-right:10px;">
        ${number}
      </span>
      ${escapeHtml(text)}
    </p>
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
