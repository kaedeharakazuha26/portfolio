# Design Direction

Reading this as: personal full-stack developer portfolio for Jhomar John Picar targeting hiring managers and engineering teams, built around a dark cosmic 3D Rubik's Cube identity with a working light theme toggle.

Dial: ENERGY 3 / RHYTHM 3 / MOTION 3

## Palette (WCAG AA Verified)
- Ground (dark): `#05070e` with solid card surface `#0a0f1c` and borders `rgba(255,255,255,0.16)`
- Ground (light): `#eef2f7` with solid card surface `#ffffff` and borders `rgba(15,23,42,0.18)`
- Primary ink: `#ffffff` (dark) / `#090d16` (light)
- Secondary ink: `#94a3b8` on `#0a0f1c` (7.46:1) / `#475569` on `#eef2f7` (6.74:1)
- Deliberate accent: `#2563eb` (interactive focus, active cube Solve action, primary selection)
- Cube faces (functional 6-domain speedcube encoding, all AA verified): Front `#1d4ed8`, Right `#c2410c`, Top `#eab308` (dark ink), Left `#15803d`, Back `#b91c1c`, Bottom `#e2e8f0` (dark ink)

## Typography
- Display: `Unbounded` for bold geometric section headings that balance the solid 3D cube silhouette.
- Body: `Space Grotesk` for crisp technical legibility across bio, timelines, and project descriptions.
- Mono: `JetBrains Mono` strictly for Rubik's notation, twist odometer digits, and code/handle tags.

## Surface & Radius System
- Radii: `12px` (`rounded-xl`) on cards and modals, `8px` (`rounded-lg`) on buttons and inputs, `6px` (`rounded-md`) on tags and chips.
- Glassmorphism dose cap (2 surfaces max): fixed top header and project modal backdrop only. All cards, buttons, and footer use crisp solid surfaces.
- Shadow dose cap: floating modal and theme confirmation popover only.
- Glow dose cap: contact form focus border only.

## Section Rhythm (RHYTHM 3)
1. Hero: asymmetric split (display name and actions left, interactive 3D cube right).
2. Tech Stack: centered headline with split interactive skill readout and 3D cube playground + bottom control dock.
3. Experience: left-aligned header with vertical timeline rail and solid dark/light role entries.
4. Projects: filterable asymmetric grid featuring the live deployed flagship app across two columns, opening a focus-managed detail modal.
5. Contact: split form card with explicit loading, validation error, and success states beside the 3D cube.
