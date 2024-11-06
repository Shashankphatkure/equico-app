import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, dateOfBirth } = await req.json();

    // Calculate age and set isOver18
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isOver18 = age >= 18;

    // Hash password
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        isOver18,
      },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        isOver18: user.isOver18,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
