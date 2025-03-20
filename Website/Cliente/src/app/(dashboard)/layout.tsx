"use client";

import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [courseId, setCourseId] = useState<string | null>(null);
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <Loading />;
    if (!user) return <div>Por favor, faça login para acessar esta página.</div>;

    return (
        <SidebarProvider>
            <div className="dashboard">
                <AppSidebar />
                <div className="dashboard__content">
                    <main className={cn("dashboard__main")} style={{ height: "100vh" }}>
                        <Navbar isCoursePage={false} />
                        <div className="dashboard__body">{children}</div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
