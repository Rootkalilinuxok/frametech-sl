// src/app/(main)/dashboard/archivio/page.tsx
"use client";

export default function ArchivioPage() {
  return (
    <main className="min-h-screen w-full bg-[url('/images/sfondo-matrix.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden />

      {/* Page content */}
      <div className="relative z-10 flex flex-col gap-6 p-6">
        {/* …contenuto dell’archivio… */}
      </div>
    </main>
  );
}
