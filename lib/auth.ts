// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function getSession() {
//   return await getServerSession(authOptions);
// }
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getSession() {
  return getServerSession(authOptions);
}
