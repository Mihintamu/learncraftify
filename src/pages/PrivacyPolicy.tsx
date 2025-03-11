
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Introduction</h2>
            <p className="text-gray-700 mb-4">
              SenpAI ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">The Data We Collect</h2>
            <p className="text-gray-700 mb-4">
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Identity Data includes first name, last name, username, or similar identifier.</li>
              <li>Contact Data includes email address and telephone numbers.</li>
              <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li>Usage Data includes information about how you use our website, products, and services.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">How We Use Your Data</h2>
            <p className="text-gray-700 mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Your Legal Rights</h2>
            <p className="text-gray-700 mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us at: 
              <a href="mailto:privacy@learncraftify.com" className="text-purple-600 hover:text-purple-800 ml-1">
                privacy@learncraftify.com
              </a>
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

export default PrivacyPolicy;
