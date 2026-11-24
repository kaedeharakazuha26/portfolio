// Projects from https://github.com/kaedeharakazuha26/portfolio and public GitHub repos.

export type ProjectFilterGroup = 'All' | 'Full-Stack' | 'Frontend & 3D';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  filterGroup: Exclude<ProjectFilterGroup, 'All'>;
  featured?: boolean;
  tagline: string;
  description: string;
  highlights: string[];
  frontend: string[];
  backend: string[];
  liveUrl: string;
  hasLiveDeploy?: boolean;
  repoUrl: string;
  accent: string;
  previewKind: 'social' | 'candles' | 'pos' | 'cube';
  previewCaption: string;
  previewBadge: string;
  imageUrl?: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'kin-link',
    title: 'LINK (Kin-Link)',
    category: 'Social Platform',
    filterGroup: 'Full-Stack',
    featured: true,
    tagline: 'Real-time social networking app built with React, Express, Firestore, and Socket.io.',
    description:
      'A Facebook-inspired full-stack social web application built with React (Vite), TypeScript, Tailwind CSS, and Shadcn/ui on the frontend, paired with Node.js, Express, Firebase Firestore, ImageKit with Sharp compression, and Socket.io.',
    highlights: [
      'Real-time updates and social interactions over Socket.io',
      'Image uploads compressed with Sharp and hosted through ImageKit',
      'Deployed live on Vercel with a TypeScript frontend and backend',
    ],
    frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Shadcn/ui', 'Vite'],
    backend: ['Node.js', 'Express', 'Firestore', 'Socket.io', 'ImageKit'],
    liveUrl: 'https://kin-link.vercel.app',
    hasLiveDeploy: true,
    repoUrl: 'https://github.com/kaedeharakazuha26/Kin-Link',
    accent: '#2563eb',
    previewKind: 'social',
    previewCaption: 'Live feeds, media compression, and Socket.io presence.',
    previewBadge: 'Live on Vercel',
  },
  {
    id: 'candlecast',
    title: 'CandleCast',
    category: 'Forecasting UI',
    filterGroup: 'Full-Stack',
    tagline: 'Crypto candlestick forecasting using Binance OHLCV data and Kronos-base.',
    description:
      'A market forecasting interface that fetches real OHLCV candle data from Binance and plots Kronos-base model forecasts directly alongside historical price action.',
    highlights: [
      'Downloads historical OHLCV candlesticks directly from Binance',
      'Overlays Kronos-base forecast candles on live market pairs',
      'Typed TypeScript frontend for charting and timeframe controls',
    ],
    frontend: ['TypeScript', 'Charting UI'],
    backend: ['Binance API', 'Kronos-base'],
    liveUrl: 'https://github.com/kaedeharakazuha26/CandleCast',
    repoUrl: 'https://github.com/kaedeharakazuha26/CandleCast',
    accent: '#15803d',
    previewKind: 'candles',
    previewCaption: 'BTCUSDT OHLCV history paired with Kronos-base forecast.',
    previewBadge: 'Binance + Kronos',
  },
  {
    id: 'joyce-pos',
    title: 'JoycePOS',
    category: 'Point of Sale App',
    filterGroup: 'Full-Stack',
    tagline: 'Offline-capable retail POS packaged with Capacitor, Electron, and SQLite.',
    description:
      'A React and TypeScript point-of-sale application configured for desktop and mobile packaging via Capacitor and Electron, using embedded SQLite storage and jsPDF receipt generation.',
    highlights: [
      'Local offline database persistence with Capacitor SQLite',
      'Packaged for desktop and mobile via Electron and Capacitor',
      'Printable PDF receipts generated client-side with jsPDF',
    ],
    frontend: ['React 19', 'TypeScript', 'Vite', 'jsPDF'],
    backend: ['SQLite', 'Capacitor', 'Electron'],
    liveUrl: 'https://github.com/kaedeharakazuha26/pos-app',
    repoUrl: 'https://github.com/kaedeharakazuha26/pos-app',
    accent: '#eab308',
    previewKind: 'pos',
    previewCaption: 'Local SQLite checkout ledger with PDF receipt export.',
    previewBadge: 'SQLite + jsPDF',
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio',
    category: 'Frontend / 3D',
    filterGroup: 'Frontend & 3D',
    tagline:
      'Interactive 3D Rubik’s Cube developer portfolio with WebGL fluid simulation, ambient links, and spring motion.',
    description:
      'My personal full-stack and AI developer portfolio built with React, TypeScript, Tailwind CSS v4, Framer Motion, and Three.js. Maps 54 skills across six domains on a playable 3x3x3 Rubik’s Cube, layered over GPU Navier-Stokes fluid trails and an interactive node-links network.',
    highlights: [
      'Playable Three.js 3x3x3 Rubik’s Cube with 90-degree slice rotations, scramble/solve unwind, keyboard notation, and Web Audio SFX',
      'Real-time WebGL Navier-Stokes fluid trails layered with an interactive ambient node-links network and elastic cursor',
      'Spring-magnification FloatingDock navigation, hover-scrolling project previews, and 3D perspective tilt cards',
      'WCAG AA checked dark and light themes with 1-click Pause Motion 2D fallback and dual Vercel/GitHub Pages builds',
    ],
    frontend: [
      'React',
      'TypeScript',
      'Three.js',
      'Tailwind CSS',
      'Framer Motion',
      'WebGL GLSL',
    ],
    backend: ['Vite', 'Web Audio', 'GitHub Pages', 'Vercel'],
    liveUrl: '#hero',
    hasLiveDeploy: true,
    repoUrl: 'https://github.com/kaedeharakazuha26/portfolio',
    accent: '#1d4ed8',
    previewKind: 'cube',
    previewCaption: '54 skill tiles, WebGL fluid trails, and interactive links.',
    previewBadge: 'Three.js + GLSL',
  },
];
