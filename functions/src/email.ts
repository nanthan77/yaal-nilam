import axios from "axios";
import * as admin from "firebase-admin";

export interface DiscoveredPropertyEmailItem {
  id: string;
  title: string;
  title_ta?: string;
  location: string;
  price_text: string;
  land_size?: string;
  phone?: string;
  video_url: string;
  channel_name: string;
  listing_id?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const DEFAULT_RECIPIENTS = ["nanthan77@gmail.com", "info@yaalnilam.com"];
const SENDER_EMAIL = "Yaal Nilam AI <leads@updates.yaalnilam.com>";
const REPLY_TO = "info@yaalnilam.com";

/**
 * Retrieves Resend API key from environment variable or Firestore config
 */
export async function getResendApiKey(): Promise<string> {
  if (process.env.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY;
  }
  try {
    const snap = await admin.firestore().collection("config").doc("email").get();
    if (snap.exists && snap.data()?.api_key) {
      return snap.data()?.api_key;
    }
  } catch {
    // Ignore fallback
  }
  return "";
}

/**
 * Sends a generic HTML email via Resend API
 */
export async function sendEmail(options: {
  to?: string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  const apiKey = await getResendApiKey();
  if (!apiKey) {
    console.warn("Missing RESEND_API_KEY. Cannot send email notification.");
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const recipients = options.to && options.to.length > 0 ? options.to : DEFAULT_RECIPIENTS;
  const from = options.from || SENDER_EMAIL;
  const replyTo = options.replyTo || REPLY_TO;

  try {
    const res = await axios.post(
      "https://api.resend.com/emails",
      {
        from,
        to: recipients,
        reply_to: replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return { success: true, messageId: res.data?.id };
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || String(err);
    console.error("Resend email delivery error:", errMsg);
    return { success: false, error: errMsg };
  }
}

/**
 * Sends the automated YouTube Property Discovery Digest Email to the admin
 */
export async function sendDiscoveryDigestEmail(
  summary: {
    run_id: string;
    total_keywords_searched: number;
    videos_found: number;
    new_discoveries: number;
    drafts_created: number;
    duplicates_ignored: number;
  },
  items: DiscoveredPropertyEmailItem[]
): Promise<EmailSendResult> {
  const dateStr = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    dateStyle: "full",
    timeStyle: "short",
  });

  const subject = `🏡 Yaal Nilam: ${items.length} New Jaffna Properties Discovered (${summary.new_discoveries} new / ${summary.drafts_created} drafts)`;

  const propertyCardsHtml = items
    .map((item, idx) => {
      const phoneHtml = item.phone
        ? `<a href="tel:${item.phone}" style="color:#0f766e;font-weight:600;text-decoration:none;">📞 ${item.phone}</a>`
        : `<span style="color:#94a3b8;">Phone not specified</span>`;

      const previewId = item.listing_id || item.id;
      const previewLink = `<a href="https://yaalnilam.com/preview/${previewId}" target="_blank" style="display:inline-block;padding:7px 12px;background:#0d9488;color:#ffffff;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;margin-right:6px;margin-bottom:6px;">👁 Preview & Approve</a>`;

      const rawPhone = (item.phone || "").replace(/[^\d]/g, "");
      const waMsg = encodeURIComponent(
        `வணக்கம், உங்கள் YouTube (${item.channel_name || "விளம்பரம்"}) காணி/வீடு விற்பனை தகவலை Yaal Nilam (yaalnilam.com) தளத்தில் சேர்க்க விரும்புகிறோம். விபரங்களைச் சரிபார்க்க: https://yaalnilam.com/preview/${previewId}`
      );
      const waOwnerLink = rawPhone
        ? `<a href="https://wa.me/${rawPhone}?text=${waMsg}" target="_blank" style="display:inline-block;padding:7px 12px;background:#25d366;color:#ffffff;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;margin-right:6px;margin-bottom:6px;">📱 WhatsApp Owner</a>`
        : "";

      const videoLink = item.video_url
        ? `<a href="${item.video_url}" target="_blank" style="display:inline-block;padding:7px 12px;background:#ef4444;color:#ffffff;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;margin-right:6px;margin-bottom:6px;">▶ Watch Video</a>`
        : "";

      const dashboardLink = `<a href="https://yaal-nilam-admin.web.app/discovered-properties/" target="_blank" style="display:inline-block;padding:7px 12px;background:#1e293b;color:#ffffff;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;margin-bottom:6px;">⚙ Admin Panel</a>`;

      return `
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:11px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          #${idx + 1} • ${item.location || "Jaffna"} • Channel: ${item.channel_name || "YouTube"}
        </div>
        <div style="font-size:16px;font-weight:700;color:#0f172a;line-height:1.4;margin-bottom:6px;">
          ${item.title}
        </div>
        ${
          item.title_ta
            ? `<div style="font-size:14px;color:#475569;margin-bottom:8px;font-family:'Segoe UI',Roboto,sans-serif;">${item.title_ta}</div>`
            : ""
        }
        <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:#334155;margin-bottom:12px;padding:8px 12px;background:#f8fafc;border-radius:6px;">
          <div><strong>💰 Price:</strong> ${item.price_text || "Negotiable"}</div>
          ${item.land_size ? `<div><strong>📐 Size:</strong> ${item.land_size}</div>` : ""}
          <div><strong>📱 Contact:</strong> ${phoneHtml}</div>
        </div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px dashed #e2e8f0;">
          ${previewLink}
          ${waOwnerLink}
          ${videoLink}
          ${dashboardLink}
        </div>
      </div>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yaal Nilam AI Property Intelligence</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #064e3b 0%, #0f766e 100%);padding:28px 24px;text-align:left;">
              <div style="color:#d1fae5;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
                YAAL NILAM • AI PROPERTY INTELLIGENCE
              </div>
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px 0;font-weight:800;">
                Daily Property Discovery Digest
              </h1>
              <div style="color:#a7f3d0;font-size:13px;">
                📅 ${dateStr} • Run ID: <code style="background:rgba(0,0,0,0.2);padding:2px 6px;border-radius:4px;">${summary.run_id}</code>
              </div>
            </td>
          </tr>

          <!-- Summary Metric Badges -->
          <tr>
            <td style="padding:20px 24px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="25%" align="center" style="padding:8px;">
                    <div style="font-size:22px;font-weight:800;color:#0f766e;">${summary.new_discoveries}</div>
                    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;">Discovered</div>
                  </td>
                  <td width="25%" align="center" style="padding:8px;border-left:1px solid #e2e8f0;">
                    <div style="font-size:22px;font-weight:800;color:#2563eb;">${summary.drafts_created}</div>
                    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;">Drafts Created</div>
                  </td>
                  <td width="25%" align="center" style="padding:8px;border-left:1px solid #e2e8f0;">
                    <div style="font-size:22px;font-weight:800;color:#d97706;">${summary.duplicates_ignored}</div>
                    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;">Duplicates</div>
                  </td>
                  <td width="25%" align="center" style="padding:8px;border-left:1px solid #e2e8f0;">
                    <div style="font-size:22px;font-weight:800;color:#475569;">${summary.total_keywords_searched}</div>
                    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;">Keywords</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content List -->
          <tr>
            <td style="padding:24px;">
              <div style="font-size:13px;color:#64748b;margin-bottom:16px;">
                Below are the newly discovered property listings extracted and analyzed by Gemini 3.8 Flash from Northern Sri Lanka property channels:
              </div>

              ${propertyCardsHtml || `<div style="text-align:center;padding:32px;color:#94a3b8;">No new properties found in this run.</div>`}

              <!-- CTA Banner -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;text-align:center;margin-top:24px;">
                <div style="font-weight:800;color:#166534;font-size:16px;margin-bottom:6px;">
                  Ready to review or publish these listings?
                </div>
                <div style="color:#15803d;font-size:13px;margin-bottom:16px;line-height:1.5;">
                  Open the Yaal Nilam Admin Dashboard to verify deed status, approve, edit, or reject.
                </div>
                <a href="https://yaal-nilam-admin.web.app/discovered-properties/" target="_blank" style="display:inline-block;padding:12px 24px;background:#0f766e;color:#ffffff;border-radius:8px;font-weight:800;font-size:14px;text-decoration:none;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                  Open Discovered Properties Dashboard →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
              <div>Yaal Nilam Platform • Jaffna Real Estate Marketplace</div>
              <div style="margin-top:4px;">Automated AI Agent Notification • Sent via Resend to ${DEFAULT_RECIPIENTS.join(", ")}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    subject,
    html,
  });
}
