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
