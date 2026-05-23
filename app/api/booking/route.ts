import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyBMA } from '@/lib/notify'
import { sendEmail, bookingEmail } from '@/lib/email'

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

    // In production, you would:
    // 1. Store booking in database
    // 2. Send confirmation email to client
    // 3. Send notification to admin
    // 4. Check availability
    
    console.log("New booking request:", {
      name,
      email,
      phone,
      service,
      date,
      time,
      location,
      notes,
      timestamp: new Date().toISOString(),
    });

    await notifyBMA({
      type: 'booking', name, phone, email, service,
      date, time, location, notes,
    })

    await sendEmail({ ...bookingEmail({ name, email, phone, service, date, time, location, notes }), replyTo: email })


    const bookingMessage = encodeURIComponent(
      `New Booking Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}${date ? `\nPreferred Date: ${date}` : ""}${time ? `\nPreferred Time: ${time}` : ""}${location ? `\nLocation: ${location}` : ""}${notes ? `\nNotes: ${notes}` : ""}`
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Booking request received! We will contact you to confirm your appointment.",
        whatsappUrl: `https://wa.me/254725297393?text=${bookingMessage}`
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
