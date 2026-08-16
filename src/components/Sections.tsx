import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import {
  CLIENTS,
  MANIFESTO,
  PROCESS,
  SERVICES,
  STATS,
  STUDIO,
  TESTIMONIALS,
  WORK,
} from '../data/content';

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e8702a]">{children}</p>
  );
}

function StoneSurface({ surface }: { surface: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: surface }} aria-hidden="true" />
      <div className="absolute inset-0 grain grain-coarse" aria-hidden="true" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Manifesto                                                           */
/* ------------------------------------------------------------------ */

export const Manifesto = memo(function Manifesto() {
  return (
    <section className="bg-black text-white px-5 sm:px-10 md:px-14 py-24 sm:py-32 md:py-40">
      <div className="max-w-[1400px] mx-auto grid gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <Eyebrow>{MANIFESTO.eyebrow}</Eyebrow>
        </Reveal>
        <div>
          <Reveal>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[0.98] max-w-[16ch]"
              style={{ letterSpacing: '-0.05em' }}
            >
              <span className="font-playfair italic font-normal">{MANIFESTO.headingItalic}</span>{' '}
              <span className="font-normal">{MANIFESTO.headingPlain}</span>
            </h2>
          </Reveal>
          <div className="mt-10 max-w-[58ch] space-y-6">
            {MANIFESTO.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 24)} delay={i * 80}>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const Services = memo(function Services() {
  return (
    <section id="services" className="bg-white text-gray-900 px-5 sm:px-10 md:px-14 py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16 mb-16">
          <Reveal>
            <Eyebrow>Services</Eyebrow>
          </Reveal>
          <div>
            <Reveal>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl leading-[0.98] max-w-[18ch]"
                style={{ letterSpacing: '-0.05em' }}
              >
                <span className="font-playfair italic font-normal">Six things</span>{' '}
                <span className="font-normal">we actually do</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-6 text-base sm:text-lg text-gray-500 max-w-[52ch] font-light leading-relaxed">
                You can buy any one of them on its own. Most clients start at the top, because a
                beautiful campaign built on an unexamined position is an expensive way to be ignored.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="border-t border-gray-200">
          {SERVICES.map((service) => (
            <Reveal key={service.num}>
              <article className="group grid grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3rem_14rem_minmax(0,1fr)_13rem] gap-4 md:gap-8 py-8 md:py-10 border-b border-gray-200 transition-colors hover:bg-gray-50">
                <span className="text-xs font-medium text-[#e8702a] pt-1.5">{service.num}</span>
                <h3
                  className="text-2xl md:text-3xl font-normal col-start-2"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {service.title}
                </h3>
                <p className="col-start-2 md:col-start-3 text-sm sm:text-base text-gray-600 leading-relaxed font-light max-w-[54ch]">
                  {service.blurb}
                </p>
                <ul className="col-start-2 md:col-start-4 text-[11px] uppercase tracking-[0.14em] text-gray-400 space-y-1.5 pt-1">
                  {service.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

export const Work = memo(function Work() {
  return (
    <section id="work" className="bg-black text-white px-5 sm:px-10 md:px-14 py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16 mb-16">
          <Reveal>
            <Eyebrow>Selected work</Eyebrow>
          </Reveal>
          <Reveal>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[0.98] max-w-[16ch]"
              style={{ letterSpacing: '-0.05em' }}
            >
              <span className="font-playfair italic font-normal">Four that</span>{' '}
              <span className="font-normal">moved</span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-20 md:space-y-32">
          {WORK.map((cs, i) => (
            <Reveal key={cs.client}>
              <article
                className={`grid gap-8 md:gap-14 md:grid-cols-2 items-center ${
                  i % 2 === 1 ? 'md:[&>figure]:order-2' : ''
                }`}
              >
                <figure className="relative aspect-[4/5] overflow-hidden border border-white/10 m-0">
                  <StoneSurface surface={cs.surface} />
                  <figcaption className="absolute left-4 bottom-4 text-[10px] uppercase tracking-[0.18em] text-white/75">
                    {cs.plate} · {cs.client} · {cs.scope}
                  </figcaption>
                </figure>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#e8702a]">
                    {cs.sector} · {cs.duration}
                  </p>
                  <h3
                    className="mt-3 text-3xl sm:text-4xl md:text-5xl font-normal"
                    style={{ letterSpacing: '-0.05em' }}
                  >
                    {cs.client}
                  </h3>
                  <p className="mt-5 text-lg text-white/85 font-light leading-relaxed max-w-[46ch]">
                    {cs.lede}
                  </p>
                  <p className="mt-4 text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-[50ch]">
                    {cs.body}
                  </p>

                  <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
                    {cs.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="sr-only">{s.label}</dt>
                        <dd
                          className="text-2xl sm:text-3xl font-normal text-[#e8702a]"
                          style={{ letterSpacing: '-0.05em' }}
                        >
                          {s.value}
                        </dd>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export const Process = memo(function Process() {
  return (
    <section id="process" className="bg-black text-white px-5 sm:px-10 md:px-14 py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid gap-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16 mb-14">
          <Reveal>
            <Eyebrow>Process</Eyebrow>
          </Reveal>
          <Reveal>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[0.98] max-w-[18ch]"
              style={{ letterSpacing: '-0.05em' }}
            >
              <span className="font-playfair italic font-normal">How a project</span>{' '}
              <span className="font-normal">actually runs</span>
            </h2>
          </Reveal>
        </div>

        <div>
          {PROCESS.map((step) => (
            <Reveal key={step.title}>
              <div className="grid gap-2 md:grid-cols-[9rem_15rem_minmax(0,1fr)] md:gap-10 py-8 border-t border-white/15">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#e8702a] pt-1.5">
                  {step.week}
                </span>
                <h3 className="text-xl md:text-2xl font-normal" style={{ letterSpacing: '-0.04em' }}>
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-[56ch]">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Stats + clients                                                     */
/* ------------------------------------------------------------------ */

export const Stats = memo(function Stats() {
  return (
    <section className="bg-white text-gray-900 px-5 sm:px-10 md:px-14 py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <Eyebrow>Weight</Eyebrow>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div>
                <p
                  className="text-5xl md:text-7xl font-normal leading-none"
                  style={{ letterSpacing: '-0.06em' }}
                >
                  {s.value}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-gray-400">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-24 text-[11px] uppercase tracking-[0.22em] font-medium text-gray-400">
            Selected clients
          </p>
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 list-none p-0">
            {CLIENTS.map((c) => (
              <li
                key={c}
                className="text-lg sm:text-2xl text-gray-300 font-normal"
                style={{ letterSpacing: '-0.04em' }}
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const Testimonials = memo(function Testimonials() {
  return (
    <section className="bg-black text-white px-5 sm:px-10 md:px-14 py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <Eyebrow>Clients</Eyebrow>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="h-full border border-white/15 p-7 flex flex-col justify-between gap-8 m-0">
                <blockquote className="text-lg sm:text-xl font-light leading-snug text-white/90">
                  <span className="font-playfair italic text-[#e8702a]">“</span>
                  {t.quote}
                </blockquote>
                <figcaption>
                  <p className="font-medium" style={{ letterSpacing: '-0.02em' }}>
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
                    {t.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Studio                                                              */
/* ------------------------------------------------------------------ */

export const Studio = memo(function Studio() {
  return (
    <section id="studio" className="bg-white text-gray-900 px-5 sm:px-10 md:px-14 py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto grid gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <Eyebrow>{STUDIO.eyebrow}</Eyebrow>
        </Reveal>
        <div>
          <Reveal>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl leading-[0.98] max-w-[18ch]"
              style={{ letterSpacing: '-0.05em' }}
            >
              <span className="font-playfair italic font-normal">{STUDIO.headingItalic}</span>{' '}
              <span className="font-normal">{STUDIO.headingPlain}</span>
            </h2>
          </Reveal>
          <div className="mt-8 max-w-[56ch] space-y-5">
            {STUDIO.body.map((p, i) => (
              <Reveal key={p.slice(0, 20)} delay={i * 80}>
                <p className="text-base sm:text-lg text-gray-500 font-light leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-200 pt-8">
              {STUDIO.facts.map((f) => (
                <div key={f.k}>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-gray-400">{f.k}</dt>
                  <dd className="mt-1.5 text-base" style={{ letterSpacing: '-0.02em' }}>
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const Contact = memo(function Contact() {
  return (
    <section
      id="contact"
      className="bg-black text-white px-5 sm:px-10 md:px-14 py-28 sm:py-40 text-center"
    >
      <div className="max-w-[1000px] mx-auto">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2
            className="mt-8 text-5xl sm:text-7xl md:text-8xl leading-[0.9]"
            style={{ letterSpacing: '-0.06em' }}
          >
            <span className="block font-playfair italic font-normal">Tell us what</span>
            <span className="block font-normal -mt-1">won't move</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-[44ch] mx-auto">
            Send one paragraph about the thing that is stuck. We reply to everything within two
            working days, usually with a question rather than a deck.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <a
            href="mailto:hello@movingstone.design"
            className="inline-flex items-center gap-2 mt-10 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-8 py-4 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
          >
            hello@movingstone.design
            <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
});
