export default function Homepage() {
  return (
    <main className="p-4">
      <section className="section">
        <h2 className="label">Homepage</h2>
        <p className="text-sm text-mono-muted mt-1">Monochrome baseline</p>
        <div className="mt-4 flex gap-2">
          <button className="btn">Primary</button>
          <button className="btn-ghost">Ghost</button>
        </div>
      </section>
    </main>
  );
}
