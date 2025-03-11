import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const ealunoRota = createRouteMatcher(["/user/(.*)"])
const eprofessorRota = createRouteMatcher(["/teacher/(.*)"])


export default clerkMiddleware(async (auth, req) => {
    const { sessionClaims } = await auth();
    const userRole = (sessionClaims?.metadata as { usertype: "aluno" | "professor"})?.usertype || "student";

    if (ealunoRota(req)) {
        if (userRole !== "aluno") {
            const url = new URL("/teacher/course", req.url);
            return NextResponse.redirect(url);
        }
    }

    if (eprofessorRota(req)) {
        if (userRole !== "professor") {
            const url = new URL("/user/course", req.url);
            return NextResponse.redirect(url);
        }
    }
});

export const config ={
    matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    ],
};