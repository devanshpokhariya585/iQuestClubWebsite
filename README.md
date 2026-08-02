# Innovators Quest — Neo-City Home Page

An immersive, WebGL-driven landing page for the Innovators Quest tech club, styled
as an **electric-pink + white "neo-city"** neon experience. The signature element
is a real **3D microchip**: it floats, reacts to your cursor, and splits open on
click to reveal a glowing core with rising energy motes.

## Look & feel

- **Palette:** electric pink `#ff2d95`, hot light pink `#ff7ad4`, white, on a
  neo-city night `#0a0510` with pink glow pools + a faint neon grid and horizon.
- **Normal system cursor** (the custom cursor was removed).
- **Cinematic boot loader**, **momentum smooth scroll** (Lenis), and
  scroll-reveal choreography throughout.

## The upgraded processor (`src/three/Chip.jsx`)

- Crisp **neon edge outlines** on the substrate, lids and core (drei `<Edges>`).
- A **layered core**: an emissive pink shell around a bright white inner that
  ramps up when opened.
- **Rising energy motes** that stream out of the core while it's open.
- **Two counter-rotating aura rings** + glowing pins and corner nodes.
- **Bloom** postprocessing makes all the emissive pink read like signage.

## Sections on the home page

1. Navbar
2. Hero — huge type over the sealed 3D chip
3. Marquee — infinite neon ticker
4. About — the clickable 3D processor + revealed core
5. Capabilities ("The Stack") — five neon cards
6. Impact — count-up stats band
7. Events — hover-reactive list
8. Team — holographic member cards
9. Newsletter — signup with success state
10. Footer

## Tech stack

React 18 + Vite · three / @react-three/fiber / @react-three/drei ·
@react-three/postprocessing (bloom) · lenis (smooth scroll) · framer-motion ·
Tailwind CSS · lucide-react.

## Project structure

```
innovators-quest/
├── index.html
├── tailwind.config.js          # pink/white tokens + marquee keyframes
├── src/
│   ├── App.jsx                 # loader gate + smooth scroll + sections
│   ├── index.css               # neo-city base, glow utilities, scanlines
│   ├── lib/useLenis.js         # momentum scroll + anchor gliding
│   ├── three/
│   │   ├── Chip.jsx            # the 3D processor
│   │   └── ChipCanvas.jsx      # Canvas + lights + bloom
│   ├── components/
│   │   ├── Loader.jsx  Navbar.jsx  Hero.jsx  Marquee.jsx
│   │   ├── About.jsx  Capabilities.jsx  Stats.jsx
│   │   ├── Events.jsx  Team.jsx  Newsletter.jsx  Footer.jsx
│   └── data/content.js         # ALL copy/data
```

## Setup & run

Requires **Node.js 18+**.

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build
npm run preview
```

## Customizing

- **Copy / events / team / stats** — everything is in `src/data/content.js`.
- **Colors** — `tailwind.config.js` (`pink`, `neon`, `magenta`) + the glow rgba
  values in `src/index.css`.
- **Processor** — `src/three/Chip.jsx` (`useFrame` block = open transforms, glow
  ramps, mote speed). `ChipCanvas.jsx` = camera, lights, **bloom strength**
  (lower `intensity` / raise `luminanceThreshold` if the neon feels too hot).
- **Scroll weight** — `src/lib/useLenis.js` (`lerp`; lower = heavier).

## Wire the newsletter to Express

`Newsletter.jsx` has a `// TODO` in `handleSubmit`:

```js
await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
})
```

## Notes

- Two WebGL canvases (hero + about) with bloom — smooth on modern hardware. For
  low-end phones, drop the hero canvas or lower `dpr` in `ChipCanvas.jsx`.
- `prefers-reduced-motion` disables smooth scroll, shortcuts the loader, and
  settles animations instantly.
- Swap the procedural chip for a real `.glb` via `useGLTF` inside `Chip.jsx` when
  you're ready — nothing else changes.

## Update — processor & floating sections

- The processor no longer free-spins; it holds its **detailed top face toward the
  camera** and gently sways + parallaxes to the cursor, so the traces, core, fins
  and pins stay readable. Added: recessed lid panels, heat fins, signal traces, a
  spinning core crown, SMD parts and a traveling data pulse.
- **Active-Theory-style floating** (`src/components/Floaty.jsx`) is applied to the
  Events board and the Capabilities/Team card grids: each item reveals on scroll,
  drifts toward the cursor by a per-item `depth`, and idly bobs. Tune `depth` per
  section or the bob in `Floaty.jsx`.

## Update — multi-page app, portal, spiral team, hero + font

**Now a routed multi-page app** (react-router-dom). Font switched to **Sora**
(techy + minimal). The hero processor is smaller, hero text is smaller, and the
hero gained a live clock, quick-stat pills and dual CTAs (kept minimal).

Routes:
- `/` — Home
- `/events/past` — **Past Events** (year filter, floating recap cards)
- `/calendar` — **Upcoming Events Calendar** (month grid + agenda)
- `/team` — **Team** (Active-Theory-style spiral: members orbit a golden-angle
  spiral, drift with the cursor, and idle-bob)
- `/portal` — **Student Portal** (recruitment)

### Team images (transparent PNGs)
Drop bg-less PNGs into `public/team/` and add an `img` path to each member in
`src/data/content.js` (`team.members`). Without `img`, a bg-less neon badge with
initials is shown. See `public/team/README.txt`.

### Student Portal — front-end demo (no DB)
Sign up / sign in requires a **VIT email** (`…@vitstudent.ac.in` or `…@vit.ac.in`).
Tasks, quiz scores, XP and rank are stored **in the browser (localStorage)** so the
flow works with no backend. This is a demo store — replace the `readJSON/writeJSON`
helpers and the auth handlers in `src/pages/Portal.jsx` with calls to your Express +
MongoDB API when ready. (Passwords are stored in plaintext for the demo only — do
not ship that.)

### Deploying
Client-side routing needs an SPA fallback on your host (rewrite all paths to
`index.html`). Netlify: add `public/_redirects` with `/*  /index.html  200`.
Vercel: a rewrite to `/index.html`. `npm run dev` and `npm run preview` already
handle this locally.

## Update — hero declutter + cylindrical team

- **Hero:** removed the clock/pills/extra CTA — only the "Explore the chip" button
  remains. The 3D chip is **lifted up** (`lift={1.25}` on `ChipCanvas`) so the
  INNOVATORS QUEST title no longer covers it. Adjust `lift` / `scale` in
  `src/components/Hero.jsx`.
- **Team (`/team`):** now a **scroll-driven 3D cylinder**. Each board member is a
  card arranged around a cylinder; scrolling rotates it so members come to the
  front one by one, with a live name/role + progress dots on the left. Tune the
  scroll length via `height: ${N*95}vh`, the tilt via `rotateX(-7deg)`, and card
  size/radius in the `calc()` effect (all in `src/pages/TeamPage.jsx`). Reduced-
  motion users get a static grid. Add member photos via the `img` field in
  `content.js` (they map onto the card face).
