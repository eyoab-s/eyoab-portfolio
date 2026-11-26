export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page-shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6">
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
          © {new Date().getFullYear()} Eyoab Seifu
        </span>

        <span className="mono text-[11px] uppercase tracking-[0.12em] text-graphite">
          Addis Ababa, Ethiopia
        </span>

        <a
          href="#"
          className="mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-50"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}