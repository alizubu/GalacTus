import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // ── Option A: Resend ──────────────────────────────────────────────────────
    // Install: npm install resend
    // Add to .env.local: RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Portfolio Contact <onboarding@resend.dev>",
    //   to: ["shelveyedias@gmail.com"],
    //   subject: `[Portfolio] ${subject}`,
    //   html: `
    //     <div style="font-family:sans-serif;max-width:600px">
    //       <h2>New Contact Form Submission</h2>
    //       <p><strong>Name:</strong> ${name}</p>
    //       <p><strong>Email:</strong> ${email}</p>
    //       <p><strong>Subject:</strong> ${subject}</p>
    //       <hr/>
    //       <p><strong>Message:</strong></p>
    //       <p>${message.replace(/\n/g, "<br/>")}</p>
    //     </div>`,
    // });
    // ─────────────────────────────────────────────────────────────────────────

    // ── Fallback: log to console (works without any setup) ───────────────────
    console.log("📬 New contact form submission:", {
      name,
      email,
      subject,
      message,
    });
    // ─────────────────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
