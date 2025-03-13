"use client";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: {children: React.ReactNode}) {
    const pathname = usePathname();
    const [courseId, setCourseId] = useState<string | null>(null);
    const { user, isloaded } = useUser();

    if (!isloaded) return <Loading />;
    if (!user) return <div>Porfavor faça login para aceder a esta pagina.</div>

  return (
    <SidebarProvider>
        <div className="dashboard">
            <AppSidebar />
            <div className="dashboard__content">
            <div className={cn ("dashboard__main", )} style={{ height: "100vh"}}></div>
          <main className="dashboard__body"> </main>
          </div>
        </div>
    </SidebarProvider>
  );
}
