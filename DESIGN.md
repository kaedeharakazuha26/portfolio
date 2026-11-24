# Design Direction

Reading this as: personal full-stack and AI developer portfolio for Jhomar John Picar, built with an original obsidian-and-amber studio identity featuring a playable 3D Rubik's Cube, interactive node links, WebGL fluid simulation, and spring-physics docks.

Dial: ENERGY 3 / RHYTHM 3 / MOTION 3

## Palette (WCAG AA Verified)
- Dark ground: `#09090b` with solid card surface `#121318` and borders `rgba(255,255,255,0.14)`
- Light ground: `#f5f4f0` with solid card surface `#ffffff` and borders `rgba(17,18,23,0.16)`
- Primary ink: `#fafafa` (dark) / `#111217` (light)
- Secondary ink: `#a1a1aa` on `#121318` (7.24:1) / `#52525b` on `#f5f4f0` (7.02:1)
- Deliberate accent: `#f59e0b` with `#09090b` ink in dark mode (9.26:1) and `#b45309` with `#ffffff` ink in light mode (5.02:1)
- Cube faces (6 functional speedcube colors, all AA verified): Front `#1d4ed8`, Right `#c2410c`, Top `#eab308`, Left `#15803d`, Back `#b91c1c`, Bottom `#e2e8f0`

## Typography
- Display: `Space Grotesk` (500/600/700) for crisp, balanced geometric headlines without stretched letterforms.
- Body: `Plus Jakarta Sans` (400/500/600/700) for warm, clear reading across bios and project specs.
- Mono: `JetBrains Mono` strictly for cube notation, twist odometer digits, and technical tags.

## Surface & Motion System
- Glassmorphism dose cap (2 surfaces max): fixed top header rail and modal backdrop only.
- Shadow dose cap: floating modals and bottom spring dock only.
- Interactive motion: `AmbientLinksCanvas` (node proximity links + click bursts), `WebGLFluidCanvas` (GPU Navier-Stokes pointer fluid), `FloatingDock` (spring magnification), `ScrollingPreview` (smooth hover pan on tall project views), and 3D Rubik's Cube scroll choreography. All stop immediately when Pause Motion is active.

## Section Rhythm (RHYTHM 3)
1. Hero: 3D Rubik's Cube commands the left side, sculptural identity and quick controls on the right.
2. Projects: elevated right after Hero with hover-scrolling previews, 3D spring tilt, and spring-magnified tech docks inside the detail modal.
3. Interactive 3D Skill Cube: cube centered left with face selector and skill inspector on the right.
4. Certifications: 3-slot credential ledger with real MSTConnect Bootcamp 2026 preview and PDF.
5. Experience: compact vertical timeline rail with warm amber current indicator.
6. Contact: Left-column validated form with quick social/spin controls paired with the interactive 3D Rubik's Cube on the right stage.
