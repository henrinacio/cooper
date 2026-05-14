import BottomNav from "@/components/navigation/bottom-nav";
import SidebarNav from "@/components/navigation/sidebar-nav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex">
      <SidebarNav />
      <div className="flex-1 flex flex-col md:ml-56">
        <div className="flex-1 p-5 pb-20 md:pb-5">
          {children}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
