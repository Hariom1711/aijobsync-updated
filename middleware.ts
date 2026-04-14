// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // if not authed, go here
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",   // protect dashboard and all sub-routes
    // add more protected areas as you build:
    "/profile/:path*",
    "/resume/:path*",
    "/resumes/:path*",
    "/templates/:path*",
    "/import/:path*",
    "/analyzer/:path*",
    "/settings/:path*",
  ],
};
