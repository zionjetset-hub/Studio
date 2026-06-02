import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden lg:ml-0">
        <div className="mx-auto max-w-7xl px-4 py-8 pt-16 lg:px-8 lg:py-10 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
