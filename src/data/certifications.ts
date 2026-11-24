// Earned and planned certifications.
// Place future certificate files in public/certificates/ and reference them with BASE_URL.

const BASE = import.meta.env.BASE_URL;

export interface CertificationItem {
  id: string;
  slotLabel: string;
  title: string;
  issuer: string;
  date: string;
  status: 'earned' | 'upcoming';
  credentialId?: string;
  credentialUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  summary?: string;
  topics?: string[];
}

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'mstconnect-fullstack-2026',
    slotLabel: 'Certificate 01',
    title: 'Full-Stack Web Development Intensive Bootcamp 2026',
    issuer: 'MSTConnect Educational Consultancy',
    date: 'Oct 2026',
    status: 'earned',
    credentialId: '60-Hour Training · PRC CPD OCE-2022-062',
    imageUrl: `${BASE}certificates/mstconnect-fullstack-bootcamp-2026.jpg`,
    pdfUrl: `${BASE}certificates/mstconnect-fullstack-bootcamp-2026.pdf`,
    topics: ['HTML & CSS', 'JavaScript', 'Back-End & APIs', 'React'],
  },
  {
    id: 'cert-2',
    slotLabel: 'Certificate 02',
    title: 'Upcoming Certification',
    issuer: 'In progress',
    date: 'Expected January',
    status: 'upcoming',
  },
  {
    id: 'cert-3',
    slotLabel: 'Certificate 03',
    title: 'Upcoming Certification',
    issuer: 'In progress',
    date: 'Expected January',
    status: 'upcoming',
  },
];
