import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const formData = await req.formData();
    const horseId = params.id;

    // Handle file upload if present
    let documentUrl = null;
    const document = formData.get("documents");
    if (document) {
      // Implement file upload logic here (e.g., using AWS S3 or similar)
      // documentUrl = await uploadFile(document)
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        horseId,
        type: formData.get("type"),
        date: new Date(formData.get("date")),
        description: formData.get("description"),
        veterinarian: formData.get("veterinarian"),
        documents: documentUrl,
        cost: formData.get("cost") ? parseFloat(formData.get("cost")) : null,
        notes: formData.get("notes"),
      },
    });

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { error: "Error creating medical record" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const horseId = params.id;
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { horseId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Error fetching medical records" },
      { status: 500 }
    );
  }
}
