import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import SidebarContent from "@/components/layout/SidebarContent";
import { SidebarProvider } from "@/components/layout/SidebarProvider";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider>
      <div className="flex h-dvh overflow-hidden">
        <Sidebar>
          <SidebarContent />
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
