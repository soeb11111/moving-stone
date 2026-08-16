export const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';

export const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';

export const NAV_LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Process', href: '/#process' },
  { label: 'Studio', href: '/#studio' },
] as const;

export const MANIFESTO = {
  eyebrow: 'The studio',
  headingItalic: 'A brand at rest',
  headingPlain: 'stays at rest',
  paragraphs: [
    'Most categories are not competitive. They are frozen. Every company in the sector uses the same eleven adjectives, the same stock photography of people pointing at laptops, the same sans-serif set in grey. Nothing is wrong, and nothing moves.',
    'We are a design studio built for that specific problem. We find the one true thing a company can say that nobody else can, then give it a form so particular that it cannot be mistaken for the competition — identity, product, web, motion, packaging, and the systems that keep it intact after we leave.',
    'Six years. Ninety-one projects shipped. Four categories where the shelf now looks different.',
  ],
};

export interface Service {
  num: string;
  title: string;
  blurb: string;
  deliverables: string[];
}

export const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Brand identity',
    blurb:
      'Naming, wordmark, typography, colour, art direction and the written voice that carries them. We build identity systems that survive contact with a real marketing team — flexible enough to stretch, rigid enough to stay recognisable.',
    deliverables: ['Naming & narrative', 'Logo & wordmark', 'Type & colour system', 'Brand guidelines'],
  },
  {
    num: '02',
    title: 'Digital product',
    blurb:
      'End-to-end product design: research, information architecture, wireframes, interface design and clickable prototypes. We design against real constraints, working directly with your engineers rather than throwing files over a wall.',
    deliverables: ['UX research', 'IA & flows', 'UI design', 'Prototypes'],
  },
  {
    num: '03',
    title: 'Web design & build',
    blurb:
      'Marketing sites, editorial platforms and commerce, designed and shipped by one team. Built on React and headless CMS, tuned for Core Web Vitals, and handed over with documentation your team can actually maintain.',
    deliverables: ['Art direction', 'Design & build', 'CMS integration', 'Performance & SEO'],
  },
  {
    num: '04',
    title: 'Motion & 3D',
    blurb:
      'Film, CGI, product visualisation and interface motion. Our 3D work started as a way to photograph things that do not exist yet, and became a way to show materials in a detail a camera cannot reach.',
    deliverables: ['Brand film', 'CGI & product viz', 'Interface motion', 'Social cutdowns'],
  },
  {
    num: '05',
    title: 'Packaging & print',
    blurb:
      'Structural and graphic packaging, print collateral, exhibition and retail environments. We prototype in material early, because a pack that reads beautifully on screen and badly under shop lighting is a failed pack.',
    deliverables: ['Structural design', 'Artwork & repro', 'Retail & exhibition', 'Print management'],
  },
  {
    num: '06',
    title: 'Design systems',
    blurb:
      'Tokens, components, documentation and governance. The unglamorous layer that decides whether the identity still looks like itself two years and forty hires later.',
    deliverables: ['Token architecture', 'Component library', 'Documentation', 'Governance model'],
  },
];

export interface CaseStudy {
  plate: string;
  client: string;
  sector: string;
  duration: string;
  scope: string;
  lede: string;
  body: string;
  surface: string;
  stats: { value: string; label: string }[];
}

export const WORK: CaseStudy[] = [
  {
    plate: 'Plate 01',
    client: 'Cantera Group',
    sector: 'Quarrying & aggregates',
    duration: '14 months',
    scope: 'Identity · Web · Film',
    lede:
      'A sixty-year-old quarrying business, invisible to the architects who specified around it.',
    body:
      'Everyone in the category sold tonnage and lead times. Nobody sold the stone. We rebuilt Cantera as a source rather than a supplier — a specification library architects could actually use, a photographic archive of every quarry face, and a launch film shot across one winter. Specification enquiries stopped travelling through distributors.',
    surface: 'radial-gradient(120% 100% at 28% 18%, #7E8A83, #313B36 55%, #161B19)',
    stats: [
      { value: '+212%', label: 'Specification enquiries' },
      { value: '−41%', label: 'Cost per lead' },
      { value: '3×', label: 'Trade share of voice' },
    ],
  },
  {
    plate: 'Plate 02',
    client: 'Basalt Pay',
    sector: 'Fintech infrastructure',
    duration: '9 months',
    scope: 'Identity · Product · Design system',
    lede:
      'Payment rails for freight, losing every bake-off because the buying committee could not explain them internally.',
    body:
      'The product was better and the story was written for engineers. We rebuilt it around the problem the CFO actually has — cash trapped in transit — then designed the product surface and the sales assets to say the same thing in the same order. One spine, from first search result to signed contract.',
    surface: 'radial-gradient(110% 95% at 72% 22%, #8E8067, #4B4234 55%, #221F1A)',
    stats: [
      { value: '68%', label: 'Win rate in bake-offs' },
      { value: '−24 days', label: 'Sales cycle' },
      { value: '9×', label: 'Pipeline from content' },
    ],
  },
  {
    plate: 'Plate 03',
    client: 'Flint & Fern',
    sector: 'Premium consumer',
    duration: '7 months',
    scope: 'Identity · Packaging · Retail',
    lede:
      'A mineral skincare line with a real formulation story, buried under the same soft-focus botanicals as everything else on the shelf.',
    body:
      'We took the brand back to its geology. Pigment drawn from the rock the actives come from, a pack with genuine ground-glass texture, and a retail unit that reads from six metres away. Buyers listed it off the design before they heard the pitch.',
    surface: 'radial-gradient(115% 100% at 38% 78%, #52736A, #24352F 55%, #131A17)',
    stats: [
      { value: '6', label: 'National listings' },
      { value: '127%', label: 'Sell-through vs forecast' },
      { value: '2×', label: 'Repeat purchase rate' },
    ],
  },
  {
    plate: 'Plate 04',
    client: 'Northline Rail',
    sector: 'Transport infrastructure',
    duration: '11 months',
    scope: 'Wayfinding · Design system · Motion',
    lede:
      'Eleven regional operators, eleven visual languages, and passengers who could not tell which train was theirs.',
    body:
      'We designed one wayfinding and information system across the whole network — a single type family, a colour logic tied to line rather than operator, and animated departure boards that degrade gracefully on twenty-year-old hardware. Complaints about signage fell by more than half in the first year.',
    surface: 'radial-gradient(120% 100% at 60% 30%, #64707A, #2C363C 55%, #14191D)',
    stats: [
      { value: '−54%', label: 'Wayfinding complaints' },
      { value: '11', label: 'Operators unified' },
      { value: '340', label: 'Stations rolled out' },
    ],
  },
];

export const PROCESS = [
  {
    week: 'Week 1–3',
    title: 'Survey',
    body: 'Interviews with your customers, your lost deals and your sales floor. A category audit that puts every competitor on one wall. We end with a written brief and a recommendation you are free to take elsewhere.',
  },
  {
    week: 'Week 4–6',
    title: 'Core sample',
    body: 'Three design territories, each a genuinely different answer rather than three shades of the same one. Pressure-tested against real buyers, not a boardroom. One is chosen.',
  },
  {
    week: 'Week 7–14',
    title: 'Cut',
    body: 'The chosen route becomes a system: type, colour, imagery, motion, layout, voice. Everything drawn, nothing borrowed. Weekly reviews, no reveal theatre.',
  },
  {
    week: 'Week 15–20',
    title: 'Polish',
    body: 'Application across every surface that matters — product, site, pack, film, deck. This is where systems usually fall apart, so this is where we spend the most time.',
  },
  {
    week: 'Ongoing',
    title: 'Set',
    body: 'Documentation, tokens, templates and a handover your team can run without us. We stay on retainer for the first two quarters to catch drift while the habits form.',
  },
];

export const STATS = [
  { value: '91', label: 'Projects shipped' },
  { value: '4', label: 'Categories redrawn' },
  { value: '38', label: 'Clients since 2019' },
  { value: '87%', label: 'Retained past year one' },
];

export const TESTIMONIALS = [
  {
    quote:
      'They spent three weeks telling us things our own team already knew and had never written down. The awkward part was how much it changed.',
    name: 'Ines Marchetti',
    role: 'CMO, Cantera Group',
  },
  {
    quote:
      'We had been designing for engineers for two years. Moving Stone pointed out that the engineers were not the ones signing.',
    name: 'Daniel Okonkwo',
    role: 'CEO, Basalt Pay',
  },
  {
    quote:
      'The pack cost more than we planned and paid for itself in the first quarter. They were right, and they were insufferable about it.',
    name: 'Sarah Whitlock',
    role: 'Founder, Flint & Fern',
  },
];

export const CLIENTS = [
  'Cantera Group',
  'Basalt Pay',
  'Flint & Fern',
  'Northline Rail',
  'Verdigris Health',
  'Kiln & Co.',
  'Marlstone Capital',
  'Ferro Tools',
  'Sablé Interiors',
  'Grit Athletic',
];

export const STUDIO = {
  eyebrow: 'Studio',
  headingItalic: 'Fourteen people',
  headingPlain: 'and a very large table',
  body: [
    'Moving Stone is a fourteen-person studio in east London, working from a converted stone-cutting works we refused to rename. Designers, a writer, two developers, a 3D lead and a producer who keeps the rest of us honest about dates.',
    'We take on roughly eight projects a year. That is deliberately few. It means the people you meet in the pitch are the people who do the work, and it means we say no to categories where we would only be a second-best answer.',
  ],
  facts: [
    { k: 'Founded', v: '2019, London E1' },
    { k: 'Team', v: '14 full-time' },
    { k: 'Projects a year', v: '~8' },
    { k: 'Working languages', v: 'EN, FR, PT' },
  ],
};

export const CONTACT = {
  email: 'hello@movingstone.design',
  phone: '+44 20 7946 0412',
  address: 'Unit 7, The Quarry Works, 44 Bell Lane, London E1 7LA',
};
