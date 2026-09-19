import { COMPANY, FOOTER, CONTACT } from "@/lib/content";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-line bg-surface px-4 pt-16 pb-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-baseline gap-1.5 font-display text-[13px] tracking-[0.3em] uppercase">
              <span className="text-ink">{COMPANY.nameParts[0]}</span>
              <span className="text-accent">{COMPANY.nameParts[1]}</span>
            </div>
            <p className="mt-5 max-w-xs text-[0.875rem] leading-relaxed text-muted">
              {FOOTER.blurb}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              data-placeholder="true"
              title="Placeholder — pending confirmed company details"
              className="mt-6 inline-block text-[0.875rem] text-muted transition-colors hover:text-[var(--accent)]"
            >
              {CONTACT.email}
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER.columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-[9.5px] tracking-[0.18em] text-muted-2 uppercase">
                  {col.title}
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      {/* Deliberately inert: these pages do not exist yet, so
                          they are not dressed up as working links. */}
                      <span className="text-[0.85rem] text-muted/70">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rule-fade mt-14" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-2">
            © {year} {COMPANY.name}. {COMPANY.launch}.
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-2">
            {FOOTER.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
