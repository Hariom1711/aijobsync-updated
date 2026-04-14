// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { apiError, serverError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password)
      return apiError("Name, email, and password are required.", 400);

    if (password.length < 8)
      return apiError("Password must be at least 8 characters.", 400);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return apiError("An account with this email already exists.", 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashed },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("[signup]", error);
    return serverError("Failed to create account.");
  }
}
