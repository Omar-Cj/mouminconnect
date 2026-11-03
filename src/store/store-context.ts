import { createContext, useContext } from 'react'
import type { Company, CompanyInput, Inquiry, InquiryStatus, NewInquiryInput, User } from '@/lib/types'

export type AuthResult = { ok: true; user: User } | { ok: false; error: string }

export interface RegisterInput {
  name: string
  email: string
  phone: string
  city: string
  password: string
}

export interface StoreValue {
  users: User[]
  companies: Company[]
  inquiries: Inquiry[]
  user: User | null

  // auth
  login: (email: string, password: string) => Promise<AuthResult>
  register: (input: RegisterInput) => Promise<AuthResult>
  logout: () => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone' | 'city'>>) => void
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>

  // inquiries
  createInquiry: (input: NewInquiryInput) => Inquiry | null
  setStatus: (id: string, status: InquiryStatus, note?: string) => void
  matchCompany: (id: string, companyId: string, messageToCustomer?: string) => void
  scheduleMeeting: (id: string, at: string, messageToCustomer?: string) => void
  recordAgreement: (id: string, value: number | null, messageToCustomer?: string) => void
  cancelInquiry: (id: string, reason?: string) => void
  addMessage: (id: string, text: string) => void
  addNote: (id: string, text: string) => void

  // companies
  addCompany: (input: CompanyInput) => Company
  updateCompany: (id: string, patch: Partial<CompanyInput>) => void
  deleteCompany: (id: string) => void
}

export const StoreContext = createContext<StoreValue | null>(null)

export function useStore(): StoreValue {
  const v = useContext(StoreContext)
  if (!v) throw new Error('useStore must be used inside <StoreProvider>')
  return v
}

export function useAuth() {
  const { user, login, register, logout, updateProfile, changePassword } = useStore()
  return { user, login, register, logout, updateProfile, changePassword }
}
