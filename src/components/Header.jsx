import { useState } from 'react';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos', href: '/about' },
    { label: 'Vision', href: '/vision' },
    { label: 'Organisation', href: '/organization' },
    { label: 'Statuts', href: '/statutes' },
    { label: 'Gouvernance', href: '/governance' },
    { label: 'Programmes', href: '/programs' },
    { label: 'Adhésion', href: '/membership' },
    { label: 'Actualités', href: '/blog' },
    { label: 'Galerie', href: '/gallery' },
    { label: 'Événements', href: '/events' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Woila Community Logo" className="h-16 w-auto" />
          </a>
          
          <nav className="hidden lg:flex gap-4">
            {links.slice(0, 5).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium text-sm flex items-center gap-1">
                Plus
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 w-40 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {links.slice(5).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute top-20 left-0 right-0 bg-white shadow-lg lg:hidden">
              <nav className="flex flex-col">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
