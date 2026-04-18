// app/api/user/plan/route.ts
// Dummy plan toggle for now — real Razorpay integration comes next sprint
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, apiSuccess, serverError } from "@/lib/api-helpers";

// GET — fetch current plan
export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  return apiSuccess({ plan: user.plan });
}

// POST — toggle plan (dummy — will be replaced with Razorpay webhook)
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { plan } = await req.json();

    if (!["FREE", "PRO"].includes(plan)) {
      return apiSuccess({ error: "Invalid plan" }, 400 as any);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { plan },
      select: { id: true, email: true, plan: true },
    });

    return apiSuccess({ user: updated, message: `Plan updated to ${plan}` });
  } catch (err) {
    console.error("[user/plan POST]", err);
    return serverError("Failed to update plan.");
  }
}
