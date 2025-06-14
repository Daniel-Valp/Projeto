import ChaptersSidebar from "../ChaptersSidebar";

export default function ChaptersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 border-r border-gray-300">
        <ChaptersSidebar />
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
