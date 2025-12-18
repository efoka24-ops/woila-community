export const createPageUrl = (pageName) => {
  const pageMap = {
    'Home': '/',
    'About': '/about',
    'Vision': '/vision',
    'Governance': '/governance',
    'Organization': '/organization',
    'Statutes': '/statutes',
    'Programs': '/programs',
    'Membership': '/membership',
    'Blog': '/blog',
    'Gallery': '/gallery',
    'Events': '/events',
    'Contact': '/contact'
  };

  return pageMap[pageName] || `/${pageName.toLowerCase()}`;
};
