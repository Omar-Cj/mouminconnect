import { Route, Routes } from 'react-router'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { GuestOnly, RequireAuth } from '@/components/RequireAuth'
import { ScrollToTop } from '@/components/ScrollToTop'
import Home from '@/pages/public/Home'
import HowItWorks from '@/pages/public/HowItWorks'
import ServicesPage from '@/pages/public/ServicesPage'
import Companies from '@/pages/public/Companies'
import CompanyDetail from '@/pages/public/CompanyDetail'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import CustomerShell from '@/pages/customer/CustomerShell'
import CustomerDashboard from '@/pages/customer/Dashboard'
import NewInquiry from '@/pages/customer/NewInquiry'
import CustomerInquiryDetail from '@/pages/customer/InquiryDetail'
import Profile from '@/pages/customer/Profile'
import AdminShell from '@/pages/admin/AdminShell'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminInquiries from '@/pages/admin/Inquiries'
import AdminInquiryDetail from '@/pages/admin/InquiryDetail'
import AdminCompanies from '@/pages/admin/Companies'
import AdminCompanyForm from '@/pages/admin/CompanyForm'
import AdminCustomers from '@/pages/admin/Customers'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:slug" element={<CompanyDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<GuestOnly />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth role="customer" />}>
          <Route path="app" element={<CustomerShell />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="inquiries/new" element={<NewInquiry />} />
            <Route path="inquiries/:id" element={<CustomerInquiryDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<RequireAuth role="admin" />}>
          <Route path="admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="inquiries/:id" element={<AdminInquiryDetail />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="companies/new" element={<AdminCompanyForm />} />
            <Route path="companies/:id/edit" element={<AdminCompanyForm />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
