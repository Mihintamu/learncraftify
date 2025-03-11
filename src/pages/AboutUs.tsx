import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About LearnCraftify</h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At LearnCraftify, we're on a mission to transform how students approach their academic journey. 
              We believe that every student deserves access to high-quality educational resources that are 
              tailored to their unique learning needs.
            </p>
            <p className="text-gray-700 mb-4">
              Through our AI-powered platform, we're making personalized education accessible to students 
              everywhere, helping them save time and achieve better results.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              LearnCraftify was founded in 2023 by a team of education enthusiasts and AI specialists who 
              recognized the transformative potential of artificial intelligence in education.
            </p>
            <p className="text-gray-700 mb-4">
              What started as a simple tool to help college students with their assignments has evolved into 
              a comprehensive platform that supports students throughout their academic journey.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 mb-4">
              LearnCraftify is powered by a diverse team of educators, AI researchers, and software developers 
              who are passionate about improving education through technology.
            </p>
            <p className="text-gray-700 mb-4">
              We're constantly innovating and refining our platform based on student feedback to ensure 
              we're meeting the real needs of our users.
            </p>
          </section>
          
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Join Us Today</h2>
            <p className="text-gray-700 mb-6">
              Experience the future of education with LearnCraftify and see how our AI-powered tools can 
              transform your academic experience.
            </p>
            <Button className="rounded-full" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold mb-4">
                <span className="bg-purple-500 text-white p-1 rounded">LC</span>
                <span>LearnCraftify</span>
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
            © {new Date().getFullYear()} LearnCraftify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
