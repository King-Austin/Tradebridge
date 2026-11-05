import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment text-obsidian flex flex-col selection:bg-amberGold selection:text-obsidian">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-28 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileBottomBar />
    </div>
  );
}
