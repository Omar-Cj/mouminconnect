import type { ReactNode } from 'react'
import { StoreContext, type AuthResult, type RegisterInput, type StoreValue } from './store-context'
import type { Activity, Company, CompanyInput, Inquiry, InquiryStatus, Message, NewInquiryInput, Note, Session, User } from '@/lib/types'
import { STATUS, STORAGE_KEYS } from '@/lib/constants'
import { hashPassword } from '@/lib/auth'
import { fmtMoney, slugify } from '@/lib/format'
import { usePersistentState } from '@/lib/hooks'
import { nowIso, uid } from '@/lib/id'
import { remove } from '@/lib/storage'

function nextRef(inquiries: Inquiry[]): string {
  const max = inquiries.reduce((m, i) => {
    const n = Number(i.ref.replace(/\D/g, ''))
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 1000)
  return `MBC-${max + 1}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = usePersistentState<User[]>(STORAGE_KEYS.users, () => [])
  const [companies, setCompanies] = usePersistentState<Company[]>(STORAGE_KEYS.companies, () => [])
  const [inquiries, setInquiries] = usePersistentState<Inquiry[]>(STORAGE_KEYS.inquiries, () => [])
  const [session, setSession] = usePersistentState<Session | null>(STORAGE_KEYS.session, () => null)

  const user = session ? (users.find((u) => u.id === session.userId) ?? null) : null

  const actor = () => ({ byId: user?.id ?? 'system', byName: user?.name ?? 'System' })

  const activity = (type: Activity['type'], text: string): Activity => ({ id: uid('act_'), type, text, at: nowIso(), ...actor() })

  const patch = (id: string, fn: (i: Inquiry) => Inquiry) =>
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...fn(i), updatedAt: nowIso() } : i)))

  const customerMessage = (text: string): Message => ({
    id: uid('msg_'),
    fromId: user?.id ?? 'system',
    fromName: user?.name ?? 'Mumin Build Connect',
    fromRole: user?.role ?? 'admin',
    text,
    at: nowIso(),
  })

  // ---------- auth ----------
  const login = async (email: string, password: string): Promise<AuthResult> => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
    if (!u) return { ok: false, error: 'No account found with that email address.' }
    const hash = await hashPassword(password)
    if (hash !== u.passwordHash) return { ok: false, error: 'Incorrect password. Please try again.' }
    setSession({ userId: u.id })
    return { ok: true, user: u }
  }

  const register = async (input: RegisterInput): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase()
    if (users.some((x) => x.email.toLowerCase() === email)) {
      return { ok: false, error: 'An account with this email already exists. Try logging in instead.' }
    }
    const u: User = {
      id: uid('u_'),
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      city: input.city,
      role: 'customer',
      passwordHash: await hashPassword(input.password),
      createdAt: nowIso(),
    }
    setUsers((prev) => [...prev, u])
    setSession({ userId: u.id })
    return { ok: true, user: u }
  }

  const logout = () => {
    setSession(null)
    remove(STORAGE_KEYS.session)
  }

  const updateProfile: StoreValue['updateProfile'] = (p) => {
    if (!user) return
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...p } : u)))
  }

  const changePassword: StoreValue['changePassword'] = async (current, next) => {
    if (!user) return { ok: false, error: 'Not signed in.' }
    const currentHash = await hashPassword(current)
    if (currentHash !== user.passwordHash) return { ok: false, error: 'Your current password is incorrect.' }
    const passwordHash = await hashPassword(next)
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, passwordHash } : u)))
    return { ok: true }
  }

  // ---------- inquiries ----------
  const createInquiry: StoreValue['createInquiry'] = (input: NewInquiryInput) => {
    if (!user) return null
    const ts = nowIso()
    const inquiry: Inquiry = {
      id: uid('inq_'),
      ref: nextRef(inquiries),
      customerId: user.id,
      ...input,
      status: 'submitted',
      matchedCompanyId: null,
      meetingAt: null,
      agreementValue: null,
      createdAt: ts,
      updatedAt: ts,
      activity: [{ id: uid('act_'), type: 'created', text: 'Inquiry submitted', at: ts, byId: user.id, byName: user.name }],
      messages: [],
      notes: [],
    }
    setInquiries((prev) => [inquiry, ...prev])
    return inquiry
  }

  const setStatus: StoreValue['setStatus'] = (id, status, note) =>
    patch(id, (i) => ({
      ...i,
      status,
      activity: [...i.activity, activity('status', `Status changed to ${STATUS[status].label}${note ? ` — ${note}` : ''}`)],
    }))

  const matchCompany: StoreValue['matchCompany'] = (id, companyId, messageToCustomer) => {
    const c = companies.find((x) => x.id === companyId)
    if (!c) return
    patch(id, (i) => ({
      ...i,
      status: 'matched' as InquiryStatus,
      matchedCompanyId: companyId,
      meetingAt: null,
      activity: [...i.activity, activity('match', `${i.matchedCompanyId ? 'Re-matched' : 'Matched'} with ${c.name}`)],
      messages: messageToCustomer?.trim() ? [...i.messages, customerMessage(messageToCustomer.trim())] : i.messages,
    }))
  }

  const scheduleMeeting: StoreValue['scheduleMeeting'] = (id, at, messageToCustomer) =>
    patch(id, (i) => {
      const c = companies.find((x) => x.id === i.matchedCompanyId)
      return {
        ...i,
        status: 'meeting_scheduled' as InquiryStatus,
        meetingAt: at,
        activity: [...i.activity, activity('meeting', `Meeting scheduled${c ? ` with ${c.name}` : ''}`)],
        messages: messageToCustomer?.trim() ? [...i.messages, customerMessage(messageToCustomer.trim())] : i.messages,
      }
    })

  const recordAgreement: StoreValue['recordAgreement'] = (id, value, messageToCustomer) =>
    patch(id, (i) => ({
      ...i,
      status: 'agreement' as InquiryStatus,
      agreementValue: value,
      activity: [...i.activity, activity('agreement', `Agreement reached${value ? ` — contract value ${fmtMoney(value)}` : ''}`)],
      messages: messageToCustomer?.trim() ? [...i.messages, customerMessage(messageToCustomer.trim())] : i.messages,
    }))

  const cancelInquiry: StoreValue['cancelInquiry'] = (id, reason) =>
    patch(id, (i) => ({
      ...i,
      status: 'cancelled' as InquiryStatus,
      activity: [...i.activity, activity('cancelled', `Inquiry cancelled${reason ? ` — ${reason}` : ''}`)],
    }))

  const addMessage: StoreValue['addMessage'] = (id, text) => {
    if (!text.trim()) return
    patch(id, (i) => ({
      ...i,
      messages: [...i.messages, customerMessage(text.trim())],
      activity: [...i.activity, activity('message', `${user?.name ?? 'Someone'} sent a message`)],
    }))
  }

  const addNote: StoreValue['addNote'] = (id, text) => {
    if (!text.trim()) return
    const n: Note = { id: uid('note_'), text: text.trim(), at: nowIso(), ...actor() }
    patch(id, (i) => ({ ...i, notes: [...i.notes, n] }))
  }

  // ---------- companies ----------
  const addCompany: StoreValue['addCompany'] = (input: CompanyInput) => {
    const base = slugify(input.name) || 'company'
    let slug = base
    let n = 2
    while (companies.some((c) => c.slug === slug)) slug = `${base}-${n++}`
    const c: Company = { ...input, id: uid('c_'), slug, createdAt: nowIso() }
    setCompanies((prev) => [c, ...prev])
    return c
  }

  const updateCompany: StoreValue['updateCompany'] = (id, p) =>
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)))

  const deleteCompany: StoreValue['deleteCompany'] = (id) => setCompanies((prev) => prev.filter((c) => c.id !== id))

  const value: StoreValue = {
    users,
    companies,
    inquiries,
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    createInquiry,
    setStatus,
    matchCompany,
    scheduleMeeting,
    recordAgreement,
    cancelInquiry,
    addMessage,
    addNote,
    addCompany,
    updateCompany,
    deleteCompany,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
