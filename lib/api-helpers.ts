// lib/api-helpers.ts
// Centralized auth + response helpers — eliminates repeated boilerplate in every route

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth-options";
import { prisma } from "./prisma";

export type AuthUser = {
  id: string;
  email: string;
  plan: "FREE" | "PRO";
};

/**
 * Get authenticated user from session — single DB call.
 * Returns null if not authenticated or user not found.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, plan: true },
  });

  return user as AuthUser | null;
}

/** Standard API error response */
export function apiError(
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...details }, { status });
}

/** Standard API success response */
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

/** 401 Unauthorized */
export const unauthorized = () =>
  apiError("Unauthorized. Please sign in.", 401);

/** 404 Not Found */
export const notFound = (resource = "Resource") =>
  apiError(`${resource} not found.`, 404);

/** 500 Internal Server Error */
export const serverError = (msg = "An unexpected error occurred.") =>
  apiError(msg, 500);
