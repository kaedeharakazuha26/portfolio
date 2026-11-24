// Portfolio settings sourced from https://github.com/kaedeharakazuha26/portfolio.

export const PORTFOLIO_CONFIG = {
  projectName: '<Jhomar/>',
  firstName: 'Jhomar John',
  lastName: 'Picar',
  fullName: 'Jhomar John Picar',
  brandMark: '<Jhomar/>',
  availability: 'Available for opportunities',
  role: 'Aspiring Full-Stack Web Developer',
  bio: 'I build responsive web applications with PHP, Laravel, MySQL, JavaScript, and React.',
  footerTagline: 'Building, learning, and growing one project at a time.',
  email: '',
  displayEmail: '',
  resumeUrl: '#projects',
  resumeLabel: 'View My Projects',
  repoUrl: 'https://github.com/kaedeharakazuha26/portfolio',
  githubHandle: 'kaedeharakazuha26',
  // Set a Formspree or Web3Forms endpoint to deliver messages without a backend.
  contactEndpoint: '',
  socials: {
    github: 'https://github.com/kaedeharakazuha26',
    linkedin: 'https://www.linkedin.com/',
    twitter: '',
  },
  tooltips: {
    greeting: 'Open the browser console for keyboard cube shortcuts.',
    hireMe: 'Open for junior full-stack roles and project collaborations.',
  },
  lightModeWarning:
    'Light mode switches the page to a bright daylight palette. Switch now?',
} as const;
