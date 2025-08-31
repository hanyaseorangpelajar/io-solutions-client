export const metadata = { title: "404 — Halaman tidak ditemukan" };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section style={{ textAlign: "center", maxWidth: 720 }}>
        <h1
          style={{
            margin: 0,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            fontWeight: 900,
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            // 404 tegas & responsif
            fontSize: "clamp(5rem, 18vw, 16rem)",
            color: "var(--mantine-color-text, #0d1117)",
          }}
        >
          404
        </h1>

        <h2
          style={{
            margin: "0.5rem 0 0",
            fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
            fontWeight: 700,
            color: "var(--mantine-color-text, #0d1117)",
          }}
        >
          Halaman tidak ditemukan
        </h2>

        <p
          style={{
            margin: "0.75rem auto 0",
            color: "var(--mantine-color-dimmed, #667085)",
            fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
          }}
        >
          Maaf, alamat yang Anda akses tidak tersedia atau telah dipindahkan.
          Periksa kembali ejaan URL atau navigasikan melalui menu untuk
          melanjutkan pekerjaan Anda.
        </p>

        <p
          style={{
            margin: "0.25rem auto 0",
            color: "var(--mantine-color-dimmed, #667085)",
            fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
          }}
        >
          Jika Anda yakin ini sebuah kesalahan, silakan hubungi administrator
          sistem.
        </p>
      </section>
    </main>
  );
}
