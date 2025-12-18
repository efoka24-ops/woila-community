export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src="/logo.svg" alt="Woila Community Logo" className="h-16 w-auto mb-4" />
            <p className="text-gray-400 text-sm">
              Accompagner, Développer et Soutenir les jeunes entrepreneurs du Septentrion du Cameroun.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">À Propos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white">Qui sommes-nous</a></li>
              <li><a href="/vision" className="hover:text-white">Vision & Mission</a></li>
              <li><a href="/organization" className="hover:text-white">Organisation</a></li>
              <li><a href="/statutes" className="hover:text-white">Statuts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/programs" className="hover:text-white">Programmes</a></li>
              <li><a href="/membership" className="hover:text-white">Adhésion</a></li>
              <li><a href="/blog" className="hover:text-white">Actualités</a></li>
              <li><a href="/gallery" className="hover:text-white">Galerie</a></li>
              <li><a href="/events" className="hover:text-white">Événements</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Localisation</h4>
            <p className="text-gray-400 text-sm mb-2">Siège: Garoua</p>
            <p className="text-gray-400 text-sm mb-2">Villes: Maroua, N'Gaoundéré</p>
            <p className="text-gray-400 text-sm">
              <a href="/contact" className="hover:text-white">Nous contacter</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} Woila Community. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
