import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const data = await req.json();
    const horseId = params.id;

    const appointment = await prisma.appointment.create({
      data: {
        horseId,
        type: data.type,
        date: new Date(data.date),
        provider: data.provider,
        notes: data.notes,
        reminder: data.reminder,
      },
    });

    // If reminder is enabled, schedule a notification
    if (appointment.reminder) {
      // Implement notification scheduling logic here
      // This could integrate with a service like SendGrid, Twilio, or a custom notification system
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Error creating appointment" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const horseId = params.id;
    const appointments = await prisma.appointment.findMany({
      where: { horseId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Error fetching appointments" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { appointmentId, status } = await req.json();

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Error updating appointment" },
      { status: 500 }
    );
  }
}
