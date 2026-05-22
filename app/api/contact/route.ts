import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyBMA } from '@/lib/notify'

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, service, message } = result.data;

    // In production, you would:
    // 1. Send email notification
    // 2. Store in database
    // 3. Send WhatsApp notification
    
    // Log for now (replace with actual email/DB logic)
    console.log("New contact submission:", {
      name,
      email,
      phone,
      service,
      message,
      timestamp: new Date().toISOString(),
    });

    await notifyBMA({
      type: 'contact', name, phone, email, service, message,
    })


    // Optional: Send WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nService: ${service}\nMessage: ${message}`
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your message! We will get back to you soon.",
        whatsappUrl: `https://wa.me/254725297393?text=${whatsappMessage}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}
