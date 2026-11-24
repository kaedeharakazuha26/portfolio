// 54 skill tiles across the 6 faces of Jhomar John Picar's 3x3x3 Rubik's Cube.

export type CubeFaceId = 'F' | 'R' | 'U' | 'L' | 'B' | 'D';

export interface FaceMeta {
  id: CubeFaceId;
  label: string;
  domain: string;
  color: string;
  accent: string;
  ink: string;
  viewRotation: [number, number];
}

export interface CubeSkill {
  id: string;
  face: CubeFaceId;
  slot: number;
  short: string;
  name: string;
  domain: string;
  tagline: string;
  color: string;
  ink: string;
  symbol?: 'atom' | 'hex' | 'cube' | 'wave' | 'bolt' | 'branch' | 'db' | 'cloud' | 'terminal' | 'spark';
}

// All six face color pairs pass WCAG AA normal-text contrast (>= 4.5:1).
export const CUBE_FACES: Record<CubeFaceId, FaceMeta> = {
  F: {
    id: 'F',
    label: 'Front',
    domain: 'Frontend',
    color: '#1d4ed8',
    accent: '#60a5fa',
    ink: '#ffffff',
    viewRotation: [0.22, -0.32],
  },
  R: {
    id: 'R',
    label: 'Right',
    domain: 'Backend',
    color: '#c2410c',
    accent: '#fdba74',
    ink: '#ffffff',
    viewRotation: [0.22, -Math.PI / 2 - 0.32],
  },
  U: {
    id: 'U',
    label: 'Top',
    domain: 'Databases & Core',
    color: '#eab308',
    accent: '#fde047',
    ink: '#0f172a',
    viewRotation: [Math.PI / 2 - 0.25, -0.35],
  },
  L: {
    id: 'L',
    label: 'Left',
    domain: 'Tools & Deploy',
    color: '#15803d',
    accent: '#4ade80',
    ink: '#ffffff',
    viewRotation: [0.22, Math.PI / 2 - 0.32],
  },
  B: {
    id: 'B',
    label: 'Back',
    domain: 'IT & Service Desk',
    color: '#b91c1c',
    accent: '#f87171',
    ink: '#ffffff',
    viewRotation: [0.22, Math.PI - 0.32],
  },
  D: {
    id: 'D',
    label: 'Bottom',
    domain: 'AI & Automation',
    color: '#e2e8f0',
    accent: '#ffffff',
    ink: '#090d16',
    viewRotation: [-Math.PI / 2 + 0.28, -0.35],
  },
};

export const FACE_ORDER: CubeFaceId[] = ['F', 'R', 'U', 'L', 'B', 'D'];

interface RawTile {
  id: string;
  short: string;
  name: string;
  tagline: string;
  symbol?: CubeSkill['symbol'];
}

const RAW_FACE_SKILLS: Record<CubeFaceId, RawTile[]> = {
  F: [
    {
      id: 'html5',
      short: 'HTML',
      name: 'HTML5',
      tagline: 'Semantic and accessible markup for structured pages and forms.',
    },
    {
      id: 'css3',
      short: 'CSS',
      name: 'CSS3',
      tagline: 'Responsive layouts using custom properties, Flexbox, and CSS Grid.',
    },
    {
      id: 'javascript',
      short: 'JS',
      name: 'JavaScript (ES6+)',
      tagline: 'Interactive interfaces, DOM manipulation, and client-side logic.',
    },
    {
      id: 'react',
      short: 'React',
      name: 'React',
      tagline: 'Component-based interfaces built with hooks and typed state.',
      symbol: 'atom',
    },
    {
      id: 'typescript',
      short: 'TS',
      name: 'TypeScript',
      tagline: 'Static typing used across Kin-Link, CandleCast, and JoycePOS.',
    },
    {
      id: 'bootstrap',
      short: 'BS',
      name: 'Bootstrap',
      tagline: 'Responsive layout grids and reusable components for PHP apps.',
    },
    {
      id: 'tailwind',
      short: 'TW',
      name: 'Tailwind CSS',
      tagline: 'Utility classes paired with Shadcn/ui across React frontends.',
      symbol: 'wave',
    },
    {
      id: 'vite',
      short: 'Vite',
      name: 'Vite',
      tagline: 'Fast local dev server and static bundler for React builds.',
      symbol: 'bolt',
    },
    {
      id: 'threejs',
      short: '3D',
      name: 'Three.js',
      tagline: 'Interactive WebGL geometry and lighting behind this Rubik’s Cube.',
      symbol: 'cube',
    },
  ],

  R: [
    {
      id: 'php',
      short: 'PHP',
      name: 'PHP',
      tagline: 'Server-side web logic for database-backed storefronts and forms.',
    },
    {
      id: 'laravel',
      short: 'Lrvl',
      name: 'Laravel',
      tagline: 'MVC routing, authentication, and Eloquent models for PHP apps.',
      symbol: 'spark',
    },
    {
      id: 'blade',
      short: 'Blade',
      name: 'Blade Templates',
      tagline: 'Server-rendered templates paired with Laravel controllers.',
    },
    {
      id: 'nodejs',
      short: 'Node',
      name: 'Node.js',
      tagline: 'JavaScript server runtime used for REST and realtime backends.',
      symbol: 'hex',
    },
    {
      id: 'express',
      short: 'Ex',
      name: 'Express.js',
      tagline: 'HTTP routing powering Kin-Link and e-commerce REST endpoints.',
    },
    {
      id: 'socketio',
      short: 'WS',
      name: 'Socket.io',
      tagline: 'Live event broadcasting for real-time social updates.',
      symbol: 'bolt',
    },
    {
      id: 'crud',
      short: 'CRUD',
      name: 'CRUD Systems',
      tagline: 'Full create, read, update, and delete flows with admin views.',
    },
    {
      id: 'rest',
      short: 'API',
      name: 'REST APIs',
      tagline: 'JSON endpoints linking React clients to backend databases.',
    },
    {
      id: 'auth',
      short: 'Auth',
      name: 'Authentication',
      tagline: 'Account sign-up, login sessions, and protected admin routes.',
    },
  ],

  U: [
    {
      id: 'mysql',
      short: 'MySQL',
      name: 'MySQL',
      tagline: 'Relational schemas, table joins, and CRUD queries for PHP apps.',
      symbol: 'db',
    },
    {
      id: 'mongodb',
      short: 'MDB',
      name: 'MongoDB & Mongoose',
      tagline: 'Document schemas and queries used in Node and Express APIs.',
      symbol: 'db',
    },
    {
      id: 'firestore',
      short: 'Fire',
      name: 'Firebase Firestore',
      tagline: 'Cloud document storage backing real-time social feeds.',
      symbol: 'cloud',
    },
    {
      id: 'sqlite',
      short: 'SQLt',
      name: 'SQLite',
      tagline: 'Local embedded database for offline-capable POS transactions.',
      symbol: 'db',
    },
    {
      id: 'sql',
      short: 'SQL',
      name: 'SQL Queries',
      tagline: 'Relational modeling, joins, and structured data retrieval.',
    },
    {
      id: 'json',
      short: 'JSON',
      name: 'JSON Contracts',
      tagline: 'Predictable API payloads between browser clients and servers.',
    },
    {
      id: 'mvc',
      short: 'MVC',
      name: 'MVC Pattern',
      tagline: 'Separating data models, views, and controllers cleanly.',
    },
    {
      id: 'clean-code',
      short: 'Code',
      name: 'Clean Code',
      tagline: 'Readable files, clear naming, and straightforward control flow.',
    },
    {
      id: 'debugging',
      short: 'Dbg',
      name: 'Troubleshooting',
      tagline: 'Step-by-step diagnosis built from IT service desk experience.',
    },
  ],

  L: [
    {
      id: 'git',
      short: 'Git',
      name: 'Git',
      tagline: 'Branching, diffs, and version control across every project.',
      symbol: 'branch',
    },
    {
      id: 'github',
      short: 'GH',
      name: 'GitHub',
      tagline: 'Repository hosting, pull requests, and GitHub Pages deploys.',
      symbol: 'branch',
    },
    {
      id: 'vercel',
      short: 'VCL',
      name: 'Vercel',
      tagline: 'Static and frontend hosting for live builds like Kin-Link.',
      symbol: 'cloud',
    },
    {
      id: 'capacitor',
      short: 'Cap',
      name: 'Capacitor & Electron',
      tagline: 'Packaging React apps for desktop and mobile retail terminals.',
      symbol: 'cube',
    },
    {
      id: 'npm',
      short: 'npm',
      name: 'npm & Composer',
      tagline: 'Managing JavaScript and PHP packages cleanly per project.',
      symbol: 'terminal',
    },
    {
      id: 'imagekit',
      short: 'Media',
      name: 'ImageKit & Sharp',
      tagline: 'Image compression and hosted media delivery for user uploads.',
    },
    {
      id: 'jspdf',
      short: 'PDF',
      name: 'jsPDF Receipts',
      tagline: 'Client-side receipt export used inside JoycePOS.',
    },
    {
      id: 'vscode',
      short: 'IDE',
      name: 'VS Code & DevTools',
      tagline: 'Daily workflow for inspecting DOM layout, network, and console.',
      symbol: 'terminal',
    },
    {
      id: 'gh-actions',
      short: 'CI',
      name: 'GitHub Actions',
      tagline: 'Automated build and publish workflows on push to main.',
    },
  ],

  B: [
    {
      id: 'servicenow',
      short: 'SNow',
      name: 'ServiceNow',
      tagline: 'Tracking IT service requests, incident tickets, and handoffs.',
    },
    {
      id: 'm365',
      short: 'M365',
      name: 'Microsoft 365',
      tagline: 'End-user workspace troubleshooting and account support.',
      symbol: 'cloud',
    },
    {
      id: 'incidents',
      short: 'Ops',
      name: 'Incident Handling',
      tagline: 'Diagnosing reported issues and documenting repeatable fixes.',
    },
    {
      id: 'escalation',
      short: 'Tier2',
      name: 'Escalation Flow',
      tagline: 'Triaging complex issues with complete reproduction notes.',
    },
    {
      id: 'support',
      short: 'CX',
      name: 'Customer Support',
      tagline: 'Clear technical communication practiced at Telus International.',
    },
    {
      id: 'docs',
      short: 'Docs',
      name: 'Documentation',
      tagline: 'Writing clear incident logs, setup steps, and project READMEs.',
    },
    {
      id: 'helpdesk',
      short: 'Desk',
      name: 'IT Service Desk',
      tagline: 'Practical experience solving user issues under live queues.',
    },
    {
      id: 'mst',
      short: 'MST',
      name: 'MST Connect PH',
      tagline: 'Project-based full-stack training across frontend, backend, and SQL.',
    },
    {
      id: 'curiosity',
      short: '24/7',
      name: 'Continuous Learning',
      tagline: 'Turning newly learned concepts into working repositories.',
      symbol: 'spark',
    },
  ],

  D: [
    {
      id: 'prompt-eng',
      short: 'Prmpt',
      name: 'Prompt Engineering',
      tagline: 'Writing structured system prompts, constraints, and deterministic output formats.',
    },
    {
      id: 'llm-apis',
      short: 'LLM',
      name: 'LLM APIs',
      tagline: 'Connecting chat completions, streaming responses, and JSON schemas into web apps.',
      symbol: 'bolt',
    },
    {
      id: 'ai-agents',
      short: 'Agent',
      name: 'AI Agents',
      tagline: 'Building tool-calling agent workflows and guardrailed coding pipelines.',
      symbol: 'cube',
    },
    {
      id: 'mcp',
      short: 'MCP',
      name: 'MCP Servers',
      tagline: 'Wiring Model Context Protocol tools so assistants interact cleanly with local dev workflows.',
      symbol: 'hex',
    },
    {
      id: 'rag',
      short: 'RAG',
      name: 'RAG & Embeddings',
      tagline: 'Grounding model responses in real documents and structured search indexes.',
      symbol: 'db',
    },
    {
      id: 'huggingface',
      short: 'HF',
      name: 'Hugging Face Models',
      tagline: 'Integrating open-weights models such as Kronos-base inside CandleCast.',
      symbol: 'cloud',
    },
    {
      id: 'ai-coding',
      short: 'Flow',
      name: 'AI-Assisted Dev',
      tagline: 'Using coding agents for rapid iteration while reviewing diffs, types, and tests.',
      symbol: 'terminal',
    },
    {
      id: 'forecasting',
      short: 'ML',
      name: 'Time-Series Forecasting',
      tagline: 'Running model inference over live Binance OHLCV market candles.',
    },
    {
      id: 'ai-evals',
      short: 'Eval',
      name: 'Output Verification',
      tagline: 'Testing AI outputs against real data, accessibility checks, and strict rulesets.',
    },
  ],
};

export const CUBE_SKILLS: CubeSkill[] = FACE_ORDER.flatMap((face) => {
  const meta = CUBE_FACES[face];
  return RAW_FACE_SKILLS[face].map((tile, slot) => ({
    ...tile,
    face,
    slot,
    domain: meta.domain,
    color: meta.color,
    ink: meta.ink,
  }));
});

export const SKILL_BY_FACE_SLOT = new Map<string, CubeSkill>(
  CUBE_SKILLS.map((skill) => [`${skill.face}-${skill.slot}`, skill]),
);

export const DEFAULT_SKILL =
  CUBE_SKILLS.find((s) => s.id === 'javascript') ?? CUBE_SKILLS[0];
