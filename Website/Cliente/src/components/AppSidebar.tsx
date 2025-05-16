import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Briefcase,
  Camera,
  DollarSign,
  LogOut,
  PanelLeft,
  Settings,
  User,
  ChartArea,
  UserCog,
} from "lucide-react";
import Loading from "./Loading";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AppSidebar = ({ className }: { className?: string }) => {

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const navLinks = {
    student: [
      { icon: BookOpen, label: "Cursos", href: "/user/courses" },
      { icon: Briefcase, label: "Quizzes", href: "/user/quizzes" },
      { icon: Camera, label: "Videos", href: "/user/videos" },
      { icon: BookOpen, label: "Manuais", href: "/user/manuais" },
      { icon: User, label: "Perfil", href: "/user/profile" },
      { icon: Settings, label: "Definições", href: "/user/settings" },
    ],
    teacher: [
      { icon: BookOpen, label: "Cursos", href: "/teacher/cursos" },
      { icon: Briefcase, label: "Quizzes", href: "/teacher/quizzes" },
      { icon: Camera, label: "Videos", href: "/teacher/videos" },
      { icon: BookOpen, label: "Manuais", href: "/teacher/manuais" },
      { icon: User, label: "Perfil", href: "/teacher/profile" },
      { icon: Settings, label: "Definições", href: "/teacher/settings" },
    ],
    admin: [
      { icon: BookOpen, label: "Cursos", href: "/teacher/cursos" },
      { icon: Briefcase, label: "Quizzes", href: "/teacher/quizzes" },
      { icon: Camera, label: "Videos", href: "/teacher/videos" },
      { icon: BookOpen, label: "Manuais", href: "/teacher/manuais" },
      { icon: User, label: "Perfil", href: "/teacher/profile" },
      { icon: Settings, label: "Definições", href: "/teacher/settings" },
      { icon: ChartArea, label: "Gráficos", href: "/admin/graph" },
      { icon: UserCog, label: "Utilizadores", href: "/admin/users" },

    ],
    
  };

  if (!isLoaded) return <Loading />;
  if (!user) return <div>User not found</div>;

  const userType =
  (user.publicMetadata.userType as "student" | "teacher" | "admin") || "student";

  console.log("userType =>", userType);



  const currentNavLinks = navLinks[userType] || [];

  console.log("currentNavLinks", currentNavLinks);



  return (
    <Sidebar
    collapsible="icon"
    style={{ height: "100vh" }}
    className={cn("bg-customgreys-primarybg border-none shadow-lg", className)}
  >
  

      <SidebarHeader>
        <SidebarMenu className="app-sidebar__menu">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:bg-customgreys-secondarybg"
            >
              <div className="app-sidebar__logo-container group">
                <div className="app-sidebar__logo-wrapper">
                  <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={25}
                    height={20}
                    className="app-sidebar__logo"
                  />
                  <p className="app-sidebar__title">Hospital</p>
                </div>
                <PanelLeft className="app-sidebar__collapse-icon" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="app-sidebar__nav-menu">
          {currentNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  "app-sidebar__nav-item",
                  isActive && "bg-gray-800"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    "app-sidebar__nav-button",
                    !isActive && "text-customgreys-dirtyGrey"
                  )}
                >
                  <Link
                    href={link.href}
                    className="app-sidebar__nav-link"
                    scroll={false}
                  >
                    <link.icon
                      className={isActive ? "text-white-50" : "text-gray-500"}
                    />
                    <span
                      className={cn(
                        "app-sidebar__nav-text",
                        isActive ? "text-white-50" : "text-gray-500"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="app-sidebar__active-indicator" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => signOut()}
                className="app-sidebar__signout"
              >
                <LogOut className="mr-2 h-6 w-6" />
                <span>Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;