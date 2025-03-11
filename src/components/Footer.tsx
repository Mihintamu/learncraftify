
import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", path: "/" },
      { name: "Pricing", path: "/pricing" },
      { name: "How it Works", path: "/" },
      { name: "FAQ", path: "/" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", path: "/" },
      { name: "Blog", path: "/" },
      { name: "Tutorials", path: "/" },
      { name: "Contact Us", path: "/" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", path: "/about-us" },
      { name: "Careers", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Service", path: "/terms-of-service" }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-semibold mb-4">
              <span className="bg-purple-500 text-white p-1 rounded">
                <Cpu className="h-5 w-5" />
              </span>
              <span>SenpAI</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered study materials and assignment generation for college students.
            </p>
          </div>
          
          {footerLinks.map((group, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} SenpAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
