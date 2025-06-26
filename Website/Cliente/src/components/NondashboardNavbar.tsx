"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";


const NonDashboardNavbar = () => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  console.log("user?.publicMetadata?.userType:", user?.publicMetadata?.userType)

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          
<Link href="/" scroll={false}>
  <span className="flex items-center gap-4">
    <Image
      src="/images/Logonegativo_13.png"
      alt="Logo"
      width={180}
      height={25}
    />
<span style={{ color: "#F3F7F5", fontSize: "15px", fontWeight: "700", lineHeight: "1.2" }}>
  Formações
</span>
  </span>
</Link>
          {/* <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/"
                className="nondashboard-navbar__search-input"
                scroll={false}
              >
                <span className="hidden sm:inline">Pagina principal</span>
                <span className="sm:hidden">Principal</span>
              </Link>
              <BookOpen
                className="nondashboard-navbar__search-icon"
                size={18}
              />
            </div>
          </div> */}
        </div>
        <div className="nondashboard-navbar__actions">
          

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                  userButtonBox: "scale-90 sm:scale-100",
                },
              }}
              showName={true}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/signin"
              className="nondashboard-navbar__auth-button--login"
              scroll={false}
            >
              Log in
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;