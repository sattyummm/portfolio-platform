import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Message } from '@/models/Message';
import { Resend } from 'resend';

// Initialize the free Resend engine instance
const resend = new Resend(process.env.RESEND_API_KEY);

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment connection key.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

// 🔍 1. FETCH MESSAGES & RATINGS FOR DASHBOARD
export async function GET() {
  try {
    await connectToDatabase();
    
    // Core console session check — properly awaited for Next.js async handling
    const { cookies } = require("next/headers");
    const cookieJar = await cookies();
    const adminSession = cookieJar.get("admin_session")?.value;
    
    if (!adminSession || adminSession !== process.env.ADMIN_PASS_TOKEN) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const messages = await Message.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🚀 2. CREATE MESSAGE + TRIGGER INSTANT INBOX EMAIL ROUTING
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, message, rating } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Required structural properties missing." }, { status: 400 });
    }

    // A. Commit directly to MongoDB cluster index logs
    const savedMessage = await Message.create({ 
      name, 
      email, 
      message, 
      rating: Number(rating) || 5 
    });

    // B. Fire automated notification straight to your personal inbox email
    if (process.env.RESEND_API_KEY && process.env.PERSONAL_INBOX_EMAIL) {
      await resend.emails.send({
        from: 'Portfolio System <onboarding@resend.dev>', // Free default sending sandbox address
        to: process.env.PERSONAL_INBOX_EMAIL,
        subject: `💼 New Recruiter Message from ${name} (${rating}/5 Stars)`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #09090b; color: #f4f4f5; border-radius: 12px;">
            <h2 style="color: #3b82f6; margin-bottom: 4px;">Console Inbound Form Signal Received</h2>
            <p style="font-size: 12px; color: #71717a; margin-top: 0;">Stored inside MongoDB cluster successfully</p>
            <hr style="border-color: #27272a; margin: 20px 0;" />
            <p><strong>Sender:</strong> ${name}</p>
            <p><strong>Callback Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
            <p><strong>Recruiter Rating Score:</strong> <span style="color: #f59e0b;">${'★'.repeat(Number(rating) || 5)}</span> (${rating}/5)</p>
            <div style="background-color: #18181b; padding: 16px; border-radius: 8px; border: 1px solid #27272a; margin-top: 15px;">
              <p style="margin: 0; white-space: pre-line; line-height: 1.6;">${message}</p>
            </div>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, data: savedMessage }, { status: 201 });
  } catch (error: any) {
    console.error("Inbound pipeline processing breakdown:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}