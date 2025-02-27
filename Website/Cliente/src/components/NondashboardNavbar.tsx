import NonDashboardNavbar from "@/components/NondashboardNavbar"
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <nav className="nondashboard-navbar">
        <div className="nondashboard-navbar__container">
            <div className="nondashboard-navbar__search">
            <Link href="/" className="nondashboard-navbar__brand">
                ASDADS
            </Link>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                            <Link href="/search" className="nondashboard-navbar__search-input">
                                <span className="hidden sm:inline">Procurar Cursos</span>
                                <span className="sm:hidden">Procurar</span>
                            </Link>
                        <BookOpen className="nondashboard-navbar__search-icon" size={18}></BookOpen>
                    </div>
                </div>
            </div>
        </div>
        <div className="nondashboard-navbar__actions">
            <button className="nondashboard-navbar__notification-button">
                <span className="nondashboard-navbar__notification-indicator"></span>
                <Bell className="nondashboard-navbar__notification-icon"></Bell>
            </button>

            
        </div>
    </nav>
  );
}
