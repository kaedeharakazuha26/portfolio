// Career and training timeline from https://github.com/kaedeharakazuha26/portfolio.

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
  stack: string[];
}

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'exp-telus',
    role: 'Customer Service Representative',
    company: 'Telus International',
    location: 'Customer & Technical Support',
    period: 'Current',
    current: true,
    bullets: [
      'Provide customer support and troubleshoot technical account issues.',
      'Resolve user inquiries while maintaining accurate support records.',
      'Escalate complex technical issues with clear diagnostic context.',
    ],
    stack: ['Technical Support', 'Troubleshooting', 'Documentation', 'Escalation'],
  },
  {
    id: 'exp-servicedesk',
    role: 'Service Desk Analyst',
    company: 'IT Service Desk',
    location: 'IT Operations',
    period: 'Previous Experience',
    bullets: [
      'Diagnosed hardware, software, and account issues for end users.',
      'Managed IT service requests and documented incident resolutions.',
      'Supported daily user workflows using ServiceNow and Microsoft 365.',
    ],
    stack: ['ServiceNow', 'Microsoft 365', 'Incident Management', 'IT Support'],
  },
  {
    id: 'exp-mst',
    role: 'Full-Stack Web Development',
    company: 'MST Connect PH',
    location: 'Hands-on Training',
    period: 'Learning Track',
    bullets: [
      'Built hands-on projects spanning frontend layouts, backend logic, and SQL databases.',
      'Implemented authentication, CRUD forms, and responsive interfaces with PHP, Laravel, MySQL, JavaScript, and React.',
      'Practiced Git version control and static deployments to Vercel and GitHub Pages.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Laravel', 'MySQL', 'Bootstrap', 'React', 'Git'],
  },
];
