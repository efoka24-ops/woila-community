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
import './App.css'

function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App
