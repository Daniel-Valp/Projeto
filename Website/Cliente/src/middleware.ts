import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (!userId) return;

  const client = clerkClient();
  const user = await (await client).users.getUser(userId);
  const userRole =
    (user.publicMetadata?.userType as "student" | "teacher" | "admin") || "student";

  console.log("Middleware - userId:", userId, "userRole:", userRole, "Path:", req.nextUrl.pathname);

  // 🔁 Redireciona admin → teacher
  if (isAdminRoute(req) && userRole !== "admin") {
    const newPath = req.nextUrl.pathname.replace(/^\/admin/, "/teacher");
    return NextResponse.redirect(new URL(newPath, req.url));
  }
  

  // ⚠️ Bloqueia student de acessar teacher
  if (isTeacherRoute(req) && userRole !== "teacher" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/user/cursos", req.url));
  }

  // ⚠️ Bloqueia teacher de acessar student
  if (isStudentRoute(req) && userRole !== "student" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/teacher/cursos", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
