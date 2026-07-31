import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Karuna Dham Foundation <noreply@karunadham.org>";
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ??
  "karunadhamfoundation@gmail.com";

// ─── Contact Form ─────────────────────────────────────────────────────────────

export async function sendContactConfirmation(opts: {
  name: string;
  email: string;
  subject: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.email!,
    subject: `We received your message — ${opts.subject}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#0B8F62;padding:32px 40px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">
            💚 Thank you, ${opts.name}
          </h1>
        </div>
        <div style="background:#f9f9f7;padding:32px 40px;border-radius:0 0 12px 12px;border:1px solid #e5e5e0;border-top:none">
          <p style="font-size:16px;line-height:1.7;color:#444">
            We've received your message regarding <strong>${opts.subject}</strong> and will get back to you within 24–48 hours.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#444">
            In the meantime, explore our work at <a href="https://karunadham.org" style="color:#0B8F62">karunadham.org</a>.
          </p>
          <hr style="border:none;border-top:1px solid #e5e5e0;margin:28px 0" />
          <p style="font-size:13px;color:#888;margin:0">
            Karuna Dham Foundation — Compassion, Humanity, Care & Service
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendContactNotification(opts: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: opts.email,
    subject: `[Contact] ${opts.subject} — from ${opts.name}`,
    html: `
      <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#f4f4f4;padding:24px;border-radius:8px">
        <h2 style="margin:0 0 16px;color:#0B8F62">New Contact Message</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;font-weight:bold;width:90px">Name</td><td>${opts.name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Email</td><td><a href="mailto:${opts.email}">${opts.email}</a></td></tr>
          ${opts.phone ? `<tr><td style="padding:8px 0;font-weight:bold">Phone</td><td>${opts.phone}</td></tr>` : ""}
          <tr><td style="padding:8px 0;font-weight:bold">Subject</td><td>${opts.subject}</td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#fff;border-radius:6px;border-left:4px solid #0B8F62">
          <strong>Message:</strong>
          <p style="margin:8px 0 0;white-space:pre-wrap">${opts.message}</p>
        </div>
      </div>
    `,
  });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function sendNewsletterWelcome(opts: {
  email: string;
  name?: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.email,
    subject: "Welcome to the Karuna Dham Newsletter 🌿",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:linear-gradient(135deg,#0B8F62,#16a34a);padding:48px 40px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="margin:0;color:#FFD166;font-size:28px">Karuna Dham Foundation</h1>
          <p style="margin:12px 0 0;color:#d1fae5;font-size:16px">Compassion, Humanity, Care & Service</p>
        </div>
        <div style="background:#f9f9f7;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e5e0;border-top:none">
          <h2 style="color:#0B8F62;margin:0 0 16px">
            Welcome${opts.name ? `, ${opts.name}` : ""}! 💚
          </h2>
          <p style="font-size:16px;line-height:1.8;color:#444">
            Thank you for joining our community of change-makers. You'll receive our monthly newsletter with:
          </p>
          <ul style="font-size:16px;line-height:2;color:#444">
            <li>Impact stories from the field</li>
            <li>Upcoming events and volunteer drives</li>
            <li>New campaigns and ways to help</li>
            <li>Transparent fund utilization reports</li>
          </ul>
          <div style="text-align:center;margin:32px 0">
            <a href="https://karunadham.org/campaigns"
               style="background:#0B8F62;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
              See Active Campaigns →
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e5e0;margin:28px 0" />
          <p style="font-size:12px;color:#aaa;text-align:center;margin:0">
            You subscribed to Karuna Dham Foundation updates. 
            You can unsubscribe at any time by replying to this email.
          </p>
        </div>
      </div>
    `,
  });
}

// ─── Donation Receipt ─────────────────────────────────────────────────────────

export async function sendDonationReceipt(opts: {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  isRecurring: boolean;
  campaignTitle?: string;
  programTitle?: string;
}) {
  const symbol = opts.currency === "INR" ? "₹" : "$";
  const formattedAmount = `${symbol}${opts.amount.toLocaleString("en-IN")}`;
  const forText = opts.campaignTitle
    ? `<strong>${opts.campaignTitle}</strong>`
    : opts.programTitle
      ? `our <strong>${opts.programTitle}</strong> program`
      : "our general fund";

  return resend.emails.send({
    from: FROM,
    to: opts.donorEmail,
    subject: `Your donation of ${formattedAmount} to Karuna Dham Foundation — Thank you!`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#0B8F62;padding:40px;border-radius:12px 12px 0 0;text-align:center">
          <p style="margin:0 0 8px;font-size:40px">💚</p>
          <h1 style="margin:0;color:#fff;font-size:26px">Thank You, ${opts.donorName}!</h1>
          <p style="margin:10px 0 0;color:#d1fae5;font-size:15px">Your generosity changes lives.</p>
        </div>
        <div style="background:#f9f9f7;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e5e0;border-top:none">
          <div style="background:#fff;border:1px solid #e5e5e0;border-radius:10px;padding:24px;margin-bottom:28px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;color:#888;font-size:14px">Donation Amount</td>
                <td style="padding:10px 0;font-size:22px;font-weight:bold;color:#0B8F62;text-align:right">${formattedAmount}</td>
              </tr>
              <tr style="border-top:1px solid #f0f0f0">
                <td style="padding:10px 0;color:#888;font-size:14px">Directed To</td>
                <td style="padding:10px 0;text-align:right;font-size:14px">${forText}</td>
              </tr>
              ${
                opts.isRecurring
                  ? `
              <tr style="border-top:1px solid #f0f0f0">
                <td style="padding:10px 0;color:#888;font-size:14px">Type</td>
                <td style="padding:10px 0;text-align:right;font-size:14px;color:#0B8F62;font-weight:600">🔄 Monthly Recurring</td>
              </tr>`
                  : ""
              }
            </table>
          </div>
          <p style="font-size:16px;line-height:1.8;color:#444">
            Your contribution to ${forText} will directly fund our programs on the ground. 
            We maintain an 80%+ program expense ratio — meaning most of every rupee you give 
            reaches those who need it most.
          </p>
          <p style="font-size:15px;color:#888;line-height:1.6">
            <strong>Tax Benefit:</strong> Karuna Dham Foundation is registered under Section 80G 
            of the Income Tax Act. Your donation qualifies for a 50% deduction. 
            Please keep this email as your provisional receipt; your official certificate 
            will be emailed within 7 business days.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://karunadham.org/campaigns"
               style="background:#0B8F62;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
              See Your Impact →
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e5e0;margin:24px 0" />
          <p style="font-size:12px;color:#aaa;text-align:center;margin:0">
            Karuna Dham Foundation — Compassion, Humanity, Care & Service<br/>
            This is an automated receipt. For queries, reply to this email.
          </p>
        </div>
      </div>
    `,
  });
}

// ─── Volunteer Application ────────────────────────────────────────────────────

export async function sendVolunteerConfirmation(opts: {
  name: string;
  email: string;
  skills: string[];
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.email,
    subject: "Your volunteer application — Karuna Dham Foundation",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e">
        <div style="background:#0B8F62;padding:40px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="margin:0;color:#FFD166;font-size:26px">You're Almost a Karunite! 🌿</h1>
          <p style="margin:10px 0 0;color:#d1fae5">Thank you for stepping forward, ${opts.name}</p>
        </div>
        <div style="background:#f9f9f7;padding:40px;border-radius:0 0 12px 12px;border:1px solid #e5e5e0;border-top:none">
          <p style="font-size:16px;line-height:1.8;color:#444">
            We've received your volunteer application. Our team reviews applications 
            every Monday and will reach out within 5–7 days to schedule an orientation call.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#555">
            <strong>Your offered skills:</strong> ${opts.skills.join(", ") || "General volunteering"}
          </p>
          <p style="font-size:15px;line-height:1.7;color:#555">
            In the meantime, you can attend any of our upcoming public events — 
            no approval needed for open drives like blood donation camps and 
            tree plantation events.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://karunadham.org/events"
               style="background:#0B8F62;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
              Browse Upcoming Events →
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e5e0;margin:24px 0" />
          <p style="font-size:12px;color:#aaa;text-align:center;margin:0">
            Karuna Dham Foundation — Compassion, Humanity, Care & Service
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendVolunteerNotification(opts: {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  location: string;
  bio?: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: opts.email,
    subject: `[Volunteer] New application from ${opts.name}`,
    html: `
      <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#f4f4f4;padding:24px;border-radius:8px">
        <h2 style="margin:0 0 16px;color:#0B8F62">New Volunteer Application</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;font-weight:bold;width:110px">Name</td><td>${opts.name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Email</td><td><a href="mailto:${opts.email}">${opts.email}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Phone</td><td>${opts.phone}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Location</td><td>${opts.location}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Skills</td><td>${opts.skills.join(", ")}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Availability</td><td>${opts.availability}</td></tr>
        </table>
        ${
          opts.bio
            ? `
        <div style="margin-top:16px;padding:16px;background:#fff;border-radius:6px;border-left:4px solid #0B8F62">
          <strong>Bio:</strong>
          <p style="margin:8px 0 0">${opts.bio}</p>
        </div>`
            : ""
        }
      </div>
    `,
  });
}
