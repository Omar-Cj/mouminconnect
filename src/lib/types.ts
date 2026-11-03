export type Role = 'customer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  city: string
  role: Role
  passwordHash: string
  createdAt: string
}

export type ProjectType = 'villa' | 'apartment' | 'commercial' | 'renovation' | 'design'

export type InquiryStatus =
  | 'submitted'
  | 'under_review'
  | 'matched'
  | 'meeting_scheduled'
  | 'agreement'
  | 'completed'
  | 'cancelled'

export type Timeline = 'asap' | '1_3_months' | '3_6_months' | '6_12_months' | 'flexible'

export type ActivityType = 'created' | 'status' | 'match' | 'meeting' | 'agreement' | 'message' | 'note' | 'cancelled'

export interface Activity {
  id: string
  type: ActivityType
  text: string
  at: string
  byId: string
  byName: string
}

export interface Message {
  id: string
  fromId: string
  fromName: string
  fromRole: Role
  text: string
  at: string
}

export interface Note {
  id: string
  text: string
  at: string
  byId: string
  byName: string
}

export interface Inquiry {
  id: string
  ref: string
  customerId: string
  title: string
  projectType: ProjectType
  description: string
  city: string
  district: string
  plotSize: number | null
  floors: number | null
  hasLand: boolean
  hasDesign: boolean
  budgetMin: number
  budgetMax: number
  timeline: Timeline
  preferredStart: string | null
  preferredCompanyId: string | null
  status: InquiryStatus
  matchedCompanyId: string | null
  meetingAt: string | null
  agreementValue: number | null
  createdAt: string
  updatedAt: string
  activity: Activity[]
  messages: Message[]
  notes: Note[]
}

export type NewInquiryInput = Pick<
  Inquiry,
  | 'title'
  | 'projectType'
  | 'description'
  | 'city'
  | 'district'
  | 'plotSize'
  | 'floors'
  | 'hasLand'
  | 'hasDesign'
  | 'budgetMin'
  | 'budgetMax'
  | 'timeline'
  | 'preferredStart'
  | 'preferredCompanyId'
>

export interface PortfolioItem {
  title: string
  type: ProjectType
  year: number
  location: string
}

export interface Company {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  specialties: ProjectType[]
  services: string[]
  city: string
  address: string
  phone: string
  email: string
  founded: number
  projectsCompleted: number
  teamSize: number
  rating: number
  reviewsCount: number
  verified: boolean
  active: boolean
  accent: string
  portfolio: PortfolioItem[]
  createdAt: string
}

export type CompanyInput = Omit<Company, 'id' | 'slug' | 'createdAt'>

export interface Session {
  userId: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  at: string
}
