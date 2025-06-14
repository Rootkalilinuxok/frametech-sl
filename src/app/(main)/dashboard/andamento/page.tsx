"use client";

/**
 * Dashboard → Andamento
 * Background "Matrix" fixed to full viewport but dimmed with an overlay, so
 * the table and charts stay perfectly readable.
 */
export default function AndamentoPage() {
  return (
    <main className="relative min-h-screen w-full overflow-auto bg-neutral-950 text-white">
      {/* Matrix background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[url('/images/sfondo-matrix.jpg')] bg-cover bg-center opacity-40" /* opacity can be tweaked */
        aria-hidden
      />

      {/* Optional translucent overlay to reduce contrast */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-neutral-950/90 to-neutral-950/60"
        aria-hidden
      />

      {/* Page content */}
      <section className="mx-auto flex max-w-7xl flex-col gap-8 p-6">
        <h1 className="text-3xl font-semibold">Andamento</h1>

        {/* Example chart placeholder */}
        <div className="h-56 w-full rounded-lg bg-neutral-800/60" />

        {/* Example table placeholder */}
        <div className="overflow-x-auto rounded-lg border border-neutral-700/40 bg-neutral-800/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-800/60 text-neutral-300">
              <tr>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Valore</th>
                <th className="px-4 py-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {/* Replace with dynamic rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="even:bg-neutral-800/30">
                  <td className="px-4 py-2">2025‑06‑{10 + i}</td>
                  <td className="px-4 py-2">{Math.floor(Math.random() * 1000)}</td>
                  <td className="px-4 py-2">{i % 2 === 0 ? '↑' : '↓'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
