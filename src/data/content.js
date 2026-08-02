// All copy lives here so components stay presentational.
// Swap values or fetch from your Express API without touching the UI.

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
  { label: 'Newsletter', href: '#newsletter' },
]

export const hero = {
  status: '',
  title1: 'INNOVATORS',
  title2: 'QUEST',
  tagline: 'IGNITING INNOVATION',
  scrollHint: 'SCROLL TO BOOT',
}

export const about = {
  eyebrow: '01 · ABOUT',
  heading: 'WHO WE ARE',
  lead:
    'A community of curious minds, building innovative solutions and shaping the future through technology.',
  prompt: 'Click the processor to power up the core',
  core: {
    heading: 'CORE ONLINE',
    text:
      'We are builders, tinkerers and dreamers. From late-night hackathons to open-source projects, Innovators Quest is where ideas get compiled into reality.',
    stats: [
      { value: '500+', label: 'Members' },
      { value: '50+', label: 'Projects' },
      { value: '25+', label: 'Events' },
      { value: '10+', label: 'OSS PRs' },
    ],
  },
}

export const events = {
  eyebrow: '02 · EVENTS',
  heading: 'WHAT’S NEXT',
  subheading: 'Upcoming missions on the calendar.',
  list: [
    { id: 'q', tag: 'HACKATHON', title: 'Quantum Hack 48', date: 'SEP 12', time: '48-hour sprint', location: 'Main Lab · Block C', status: 'REGISTERING' },
    { id: 'ai', tag: 'WORKSHOP', title: 'Neural Nets from Scratch', date: 'SEP 20', time: '5:00 – 8:00 PM', location: 'Room 204 · Online', status: 'REGISTERING' },
    { id: 'oss', tag: 'OPEN SOURCE', title: 'First-PR Friday', date: 'SEP 27', time: '3:00 – 6:00 PM', location: 'Innovation Hub', status: 'FEW SEATS' },
    { id: 'demo', tag: 'SHOWCASE', title: 'Demo Night · Vol. 07', date: 'OCT 04', time: '6:30 PM onward', location: 'Auditorium A', status: 'RSVP OPEN' },
  ],
}

export const footer = {
  tagline: 'Building your bridge to the future, one commit at a time.',
  columns: [
    { title: 'Explore', links: [
      { label: 'About', href: '#about' },
      { label: 'Events', href: '#events' },
      { label: 'Projects', href: '#' },
      { label: 'Open Source', href: '#' },
    ] },
    { title: 'Community', links: [
      { label: 'Join Us', href: '#newsletter' },
      { label: 'Discord', href: '#' },
      { label: 'Code of Conduct', href: '#' },
      { label: 'Contact', href: '#' },
    ] },
  ],
  socials: ['GitHub', 'Discord', 'Instagram', 'LinkedIn'],
}

export const marquee = [
  'IGNITING INNOVATION',
  'BUILD · SHIP · REPEAT',
  'HACKATHONS',
  'OPEN SOURCE',
  'WORKSHOPS',
  'DEMO NIGHTS',
  'CURIOUS MINDS',
]

export const capabilities = {
  eyebrow: '02 · WHAT WE DO',
  heading: 'THE STACK',
  subheading: 'Five circuits, one mission — turning ideas into shipped reality.',
  items: [
    { icon: 'Code2', title: 'Projects', text: 'Real ideas, real impact. We build things people use.' },
    { icon: 'Trophy', title: 'Events', text: 'Tech events that inspire, challenge and connect.' },
    { icon: 'Rocket', title: 'Workshops', text: 'Hands-on learning, well beyond the classroom.' },
    { icon: 'Users', title: 'Community', text: 'United by passion, driven by purpose.' },
    { icon: 'GitBranch', title: 'Open Source', text: 'Build. Contribute. Give back to the commons.' },
  ],
}

export const impact = {
  eyebrow: '04 · OUR IMPACT',
  heading: 'BY THE NUMBERS',
  stats: [
    { value: 500, suffix: '+', label: 'Active Members' },
    { value: 50, suffix: '+', label: 'Projects Shipped' },
    { value: 25, suffix: '+', label: 'Events Hosted' },
    { value: 15, suffix: '+', label: 'Workshops Run' },
    { value: 10, suffix: '+', label: 'OSS Contributions' },
  ],
}

export const team = {
  eyebrow: '05 · OUR TEAM',
  heading: 'THE MINDS',
  subheading: 'The people behind the mission.',
  members: [
    { name: 'devansh pokhariya', role: 'Technical Head', initials: 'DP' },
    { name: 'Ardhra M P', role: 'Co-Secretary', initials: 'AMP' },
    { name: 'Himangi Goyal', role: 'Finace Head', initials: 'HG' },
    { name: 'Siddharth Agarwal ', role: 'Management Head', initials: 'SA' },
  ],
}

// ── Upcoming events (dated, for the calendar page) ──────────────────
export const upcomingEvents = [
  { id: 'u1', date: '2026-08-12', title: 'Quantum Hack 48', tag: 'HACKATHON', time: '48-hour sprint', location: 'Main Lab · Block C' },
  { id: 'u2', date: '2026-08-20', title: 'Neural Nets from Scratch', tag: 'WORKSHOP', time: '5:00 – 8:00 PM', location: 'Room 204 · Online' },
  { id: 'u3', date: '2026-08-27', title: 'First-PR Friday', tag: 'OPEN SOURCE', time: '3:00 – 6:00 PM', location: 'Innovation Hub' },
  { id: 'u4', date: '2026-09-04', title: 'Demo Night · Vol. 07', tag: 'SHOWCASE', time: '6:30 PM', location: 'Auditorium A' },
  { id: 'u5', date: '2026-09-15', title: 'Cloud Native Bootcamp', tag: 'WORKSHOP', time: '10:00 AM – 4:00 PM', location: 'Lab 3' },
  { id: 'u6', date: '2026-09-23', title: 'AI Agents Meetup', tag: 'MEETUP', time: '5:30 PM', location: 'Seminar Hall' },
  { id: 'u7', date: '2026-10-05', title: 'Hacktoberfest Kickoff', tag: 'OPEN SOURCE', time: 'All day', location: 'Innovation Hub' },
  { id: 'u8', date: '2026-10-18', title: 'Design Systems Jam', tag: 'WORKSHOP', time: '2:00 – 6:00 PM', location: 'Studio B' },
]

// ── Past events (recaps) ────────────────────────────────────────────
export const pastEvents = [
  { id: 'p1', date: '2026-05-10', year: '2026', title: 'Spring Hack 36', tag: 'HACKATHON', attendees: 220, blurb: '36 hours, 41 teams, 12 shipped prototypes. Winners built an on-device sign-language translator.' },
  { id: 'p2', date: '2026-03-22', year: '2026', title: 'Intro to Rust', tag: 'WORKSHOP', attendees: 95, blurb: 'A packed hall learned ownership, borrowing and their first CLI tool in an afternoon.' },
  { id: 'p3', date: '2026-02-14', year: '2026', title: 'Open Source Day', tag: 'OPEN SOURCE', attendees: 140, blurb: 'First PRs merged for 60+ first-time contributors across 15 upstream projects.' },
  { id: 'p4', date: '2025-11-30', year: '2025', title: 'Demo Night · Vol. 06', tag: 'SHOWCASE', attendees: 300, blurb: 'Eighteen teams demoed to a full auditorium. Three projects picked up incubation offers.' },
  { id: 'p5', date: '2025-10-12', year: '2025', title: 'ML Winter Camp', tag: 'BOOTCAMP', attendees: 110, blurb: 'A week of hands-on ML — from linear regression to a deployed image classifier.' },
  { id: 'p6', date: '2025-09-05', year: '2025', title: 'Founders Fireside', tag: 'TALK', attendees: 180, blurb: 'Alumni founders shared war stories from zero to Series A. Standing room only.' },
]

// ── Student portal (front-end demo, no backend) ─────────────────────
export const portalTasks = [
  { id: 't1', title: 'Complete your profile', points: 20, hint: 'Add your branch, year and skills.' },
  { id: 't2', title: 'Join the Discord server', points: 15, hint: 'Introduce yourself in #welcome.' },
  { id: 't3', title: 'Fork the starter repo', points: 25, hint: 'Star it and clone locally.' },
  { id: 't4', title: 'Ship your first pull request', points: 40, hint: 'Fix a "good first issue".' },
  { id: 't5', title: 'RSVP to an upcoming event', points: 10, hint: 'Pick one from the calendar.' },
]

export const portalQuiz = {
  title: 'Onboarding Quiz',
  questions: [
    {
      q: 'Which command stages all changes in Git?',
      options: ['git commit -a', 'git add .', 'git push', 'git stage all'],
      answer: 1,
    },
    {
      q: 'What does an eSIM-style "API key" mainly provide?',
      options: ['Styling', 'Authentication', 'Compression', 'Routing only'],
      answer: 1,
    },
    {
      q: 'Big-O of binary search on a sorted array?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
      answer: 2,
    },
    {
      q: 'React state that persists across renders uses…',
      options: ['a plain variable', 'useState / useRef', 'a for-loop', 'CSS'],
      answer: 1,
    },
  ],
}
