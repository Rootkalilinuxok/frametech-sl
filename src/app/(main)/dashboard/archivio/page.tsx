export default function Page() {
  return <div className="@container/main flex flex-col gap-4 md:gap-6" />;
}
// src/app/(main)/dashboard/archivio/page.tsx
// Updated to apply the "sfondo‑matrix" background to the whole page.
// Make sure the image file (e.g. sfondo-matrix.png or .jpg) lives in `/public`.
// If you place it elsewhere, update the path in the `bg-[url('...')]` utility below.

"use client";

import React, { ReactNode } from "react";

interface ArchivioPageProps {
  /**
   * Keep any existing children or page sections here.
   * If you already render specific components on this page, 
   * simply move them inside the <MainContent> wrapper below.
   */
  children?: ReactNode;
}

export default function ArchivioPage({ children }: ArchivioPageProps) {
  return (
    <main
      className="min-h-screen w-full bg-[url('/sfondo-matrix.png')] bg-cover bg-center bg-no-repeat"
    >
      {/* Overlay (optional) – remove if you don’t need a dark tint */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Page content – stays above the background/overlay */}
      <div className="relative z-10 flex flex-col gap-6 p-6">
        {children}
        {/* 👉  Place (or keep) your existing Archivio page UI here */}
      </div>
    </main>
  );
}
