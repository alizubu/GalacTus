import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate presence and basic format
    if (
      !name || typeof name !== "string" || name.trim().length < 2 ||
      !email || !EMAIL_RE.test(email) ||
      !subject || typeof subject !== "string" || subject.trim().length < 3 ||
      !message || typeof message !== "string" || message.trim().length < 10
    ) {
      return NextResponse.json({ error: "Please fill all fields correctly." }, { status: 400 });
    }

    // Length limits to prevent abuse
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    let saved = false;
    try {
      await db.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
        },
      });
      saved = true;
    } catch (dbErr) {
      console.error("Contact DB error:", dbErr);
      // Don't lie to user — inform them
    }

    if (!saved) {
      return NextResponse.json(
        { error: "Message could not be saved. Please email directly at shelveyedias@gmail.com" },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
