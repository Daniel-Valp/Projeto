import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId) return; // Se não estiver logado, Clerk redireciona automaticamente

  const client = clerkClient();
  const user = await (await client).users.getUser(userId);
  const userRole =
    (user.publicMetadata?.userType as "student" | "teacher") || "student";

  console.log(
    "Middleware - userId:",
    userId,
    "userRole:",
    userRole,
    "Path:",
    req.nextUrl.pathname
  );

  // Evita redirecionamento se o usuário já está na rota correta
  if (isStudentRoute(req) && userRole !== "student" && req.nextUrl.pathname !== "/teacher/cursos") {
    return NextResponse.redirect(new URL("/teacher/cursos", req.url));
  }

  if (isTeacherRoute(req) && userRole !== "teacher" && req.nextUrl.pathname !== "/user/cursos") {
    return NextResponse.redirect(new URL("/user/cursos", req.url));
  }

  return NextResponse.next(); // Continua a request normalmente
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
