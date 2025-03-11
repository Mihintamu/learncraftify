import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to SenpAI. These Terms of Service govern your use of our website and services. 
              By accessing or using our website, you agree to these terms. If you disagree with any part of the terms, 
              you may not access the service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on SenpAI's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose or for any public display;</li>
              <li>Attempt to reverse engineer any software contained on SenpAI's website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The materials on SenpAI's website are provided "as is". SenpAI makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
            <p className="text-gray-700 mb-4">
              In no event shall SenpAI or its suppliers be liable for any damages (including, without limitation, damages for loss of 
              data or profit, or due to business interruption) arising out of the use or inability to use the materials on SenpAI's website, 
              even if SenpAI or a SenpAI authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Revisions and Errata</h2>
            <p className="text-gray-700 mb-4">
              The materials appearing on SenpAI's website could include technical, typographical, or photographic errors. 
              SenpAI does not warrant that any of the materials on its website are accurate, complete, or current. 
              SenpAI may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Term and Termination</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service are effective unless and until terminated by either you or SenpAI. 
              You may terminate these Terms of Service at any time by discontinuing use of our website and destroying all materials obtained from it.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive 
              jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-50 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold mb-4">
                <span className="bg-purple-500 text-white p-1 rounded">S</span>
                <span>SenpAI</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                AI-powered study materials and assignment generation for college students.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Use Cases", "Roadmap"]
              },
              {
                title: "Resources",
                links: ["Help Center", "Blog", "Tutorials", "FAQs"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"]
              }
            ].map((group, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                      >
                        {link}
                      </a>
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
    </div>
  );
};

export default TermsOfService;
