import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyBMA } from '@/lib/notify'
import { sendEmail, bookingEmail, bookingConfirmationEmail } from '@/lib/email'

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, service, date, time, location, notes } = result.data;

    console.log("New booking request:", { name, email, phone, service, date, time, location, notes, timestamp: new Date().toISOString() });

    // 1. Notify BMA Studios (admin email) — must succeed
    const adminEmail = await sendEmail({
      ...bookingEmail({ name, email, phone, service, date, time, location, notes }),
      replyTo: email,
    })

    if (!adminEmail.ok) {
      console.error("Admin booking email failed:", adminEmail.error)
      return NextResponse.json(
        { error: "Failed to send booking request. Please try again or contact us directly on WhatsApp." },
        { status: 500 }
      )
    }

    // 2. Send confirmation to the CLIENT at the email they provided
    const clientEmail = await sendEmail({
      ...bookingConfirmationEmail({ name, service, date, time, location, notes }),
      toName: name,
      toEmail: email,
    })

    if (!clientEmail.ok) {
      // Non-fatal — admin was notified, so booking went through. Log and continue.
      console.warn("Client confirmation email failed (booking still received):", clientEmail.error)
    }

    // 3. WhatsApp / n8n notification (best-effort, non-blocking)
    notifyBMA({ type: 'booking', name, phone, email, service, date, time, location, notes }).catch(() => {})

    const bookingMessage = encodeURIComponent(
      `New Booking Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}${date ? `\nPreferred Date: ${date}` : ""}${time ? `\nPreferred Time: ${time}` : ""}${location ? `\nLocation: ${location}` : ""}${notes ? `\nNotes: ${notes}` : ""}`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Booking received! Check ${email} for your confirmation. We'll contact you shortly to confirm your appointment.`,
        whatsappUrl: `https://wa.me/254725297393?text=${bookingMessage}`,
        clientEmailSent: clientEmail.ok,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to submit booking. Please try again later." },
      { status: 500 }
    );
  }
}
