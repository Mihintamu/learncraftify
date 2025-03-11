import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About SenpAI</h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At SenpAI, we're on a mission to transform how students approach their academic journey. 
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
              SenpAI was founded in 2023 by a team of education enthusiasts and AI specialists who 
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
              SenpAI is powered by a diverse team of educators, AI researchers, and software developers 
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
              Experience the future of education with SenpAI and see how our AI-powered tools can 
              transform your academic experience.
            </p>
            <Button className="rounded-full" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
