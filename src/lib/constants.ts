import type { InquiryStatus, ProjectType, Timeline } from './types'

export const BRAND = {
  name: 'Mumin Build Connect',
  short: 'MBC',
  tagline: 'Your trusted bridge to a better home',
  taglineSo: 'Ku xidhidha riyadaada dhisme xaqiiqo',
  motto: 'Guri riyo maaha, waa qorshe',
  mottoEn: 'A home is not a dream. It is a plan.',
  phone: '+252 63 483 9529',
  phoneRaw: '252634839529',
  email: 'muminbuildconnect@gmail.com',
  location: 'Hargeisa, Somaliland',
  socials: {
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
} as const

export const WHATSAPP_URL = `https://wa.me/${BRAND.phoneRaw}`

export const PROJECT_TYPES: Record<ProjectType, { label: string; labelSo: string; description: string }> = {
  villa: {
    label: 'Villa / private home',
    labelSo: 'Guryo gaar ah',
    description: 'Family homes, villas and private residences built from the ground up.',
  },
  apartment: {
    label: 'Apartment building',
    labelSo: 'Guryo dabaqyo ah',
    description: 'Multi-storey residential buildings, rental units and compounds.',
  },
  commercial: {
    label: 'Shops & commercial',
    labelSo: 'Dukaamo iyo dhismayaal ganacsi',
    description: 'Shops, offices, warehouses, hotels and other commercial buildings.',
  },
  renovation: {
    label: 'Renovation & maintenance',
    labelSo: 'Dib-u-dhis iyo dayactir',
    description: 'Extensions, refurbishments, repairs and upgrades to existing buildings.',
  },
  design: {
    label: 'Design & planning',
    labelSo: 'Naqshadayn iyo qorshe dhisme',
    description: 'Architectural drawings, structural design, cost planning and permits.',
  },
}

export const PROJECT_TYPE_LIST = Object.keys(PROJECT_TYPES) as ProjectType[]

export const STATUS: Record<
  InquiryStatus,
  { label: string; step: number; description: string; customerHint: string }
> = {
  submitted: {
    label: 'Submitted',
    step: 0,
    description: 'The inquiry has been received and is waiting for review.',
    customerHint: 'We have received your inquiry. Our team usually responds within one working day.',
  },
  under_review: {
    label: 'Under review',
    step: 1,
    description: 'Our team is understanding the needs and shortlisting companies.',
    customerHint: 'We are reviewing your requirements and shortlisting suitable companies.',
  },
  matched: {
    label: 'Company matched',
    step: 2,
    description: 'A construction company has been matched to this inquiry.',
    customerHint: 'We have matched you with a company. Review their profile and get in touch to arrange a meeting.',
  },
  meeting_scheduled: {
    label: 'Meeting & assessment',
    step: 3,
    description: 'A meeting or site assessment has been scheduled with the company.',
    customerHint: 'A meeting is scheduled. The company will provide an evaluation, cost estimate and technical details.',
  },
  agreement: {
    label: 'Agreement reached',
    step: 4,
    description: 'The client and company have signed a construction agreement.',
    customerHint: 'Congratulations, the construction agreement is signed. We remain available if you need us.',
  },
  completed: {
    label: 'Completed',
    step: 5,
    description: 'The engagement is closed and the referral fee has been settled.',
    customerHint: 'This inquiry is closed. Thank you for building with Mumin Build Connect.',
  },
  cancelled: {
    label: 'Cancelled',
    step: -1,
    description: 'The inquiry was cancelled.',
    customerHint: 'This inquiry was cancelled. You can always start a new one.',
  },
}

export const STATUS_LIST = Object.keys(STATUS) as InquiryStatus[]
export const STATUS_FLOW: InquiryStatus[] = ['submitted', 'under_review', 'matched', 'meeting_scheduled', 'agreement']
export const OPEN_STATUSES: InquiryStatus[] = ['submitted', 'under_review', 'matched', 'meeting_scheduled']

export const TIMELINES: Record<Timeline, string> = {
  asap: 'As soon as possible',
  '1_3_months': 'Within 1 to 3 months',
  '3_6_months': 'Within 3 to 6 months',
  '6_12_months': 'Within 6 to 12 months',
  flexible: 'Flexible / not sure yet',
}

export const CITIES = ['Hargeisa', 'Burao', 'Berbera', 'Borama', 'Erigavo', 'Las Anod', 'Gabiley', 'Other'] as const

export const BUDGET_PRESETS = [
  { label: 'Under $20k', min: 5000, max: 20000 },
  { label: '$20k – $50k', min: 20000, max: 50000 },
  { label: '$50k – $100k', min: 50000, max: 100000 },
  { label: '$100k – $250k', min: 100000, max: 250000 },
  { label: '$250k+', min: 250000, max: 600000 },
] as const

export const STORAGE_KEYS = {
  users: 'mbc:v1:users',
  companies: 'mbc:v1:companies',
  inquiries: 'mbc:v1:inquiries',
  session: 'mbc:v1:session',
  contact: 'mbc:v1:contact',
  draft: 'mbc:v1:inquiry-draft',
  seeded: 'mbc:v1:seeded',
} as const

export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@muminbuildconnect.com', password: 'Admin@123' },
  customer: { email: 'amina@example.com', password: 'Demo@123' },
} as const
