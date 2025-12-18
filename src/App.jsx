import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { About } from './pages/About';
import Vision from './pages/Vision';
import Organization from './pages/Organization';
import { Statutes } from './pages/Statutes';
import { Governance } from './pages/Governance';
import Programs from './pages/Programs';
import Membership from './pages/Membership';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import { Contact } from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminBlog from './pages/admin/AdminBlog';
import AdminEvents from './pages/admin/AdminEvents';
import AdminMessages from './pages/admin/AdminMessages';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <ProtectedAdminRoute>
              <AdminMembers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedAdminRoute>
              <AdminBlog />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedAdminRoute>
              <AdminEvents />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedAdminRoute>
              <AdminMessages />
            </ProtectedAdminRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/vision" element={<Vision />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/statutes" element={<Statutes />} />
                  <Route path="/governance" element={<Governance />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Layout>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
