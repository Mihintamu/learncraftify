
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, GraduationCap, FileText, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Personalized Study Materials",
    description: "Generate custom study notes tailored to your learning style and course requirements."
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Assignment Generation",
    description: "Create perfectly formatted assignments following your institution's guidelines."
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "AI-Powered Content",
    description: "Leverage advanced AI to generate accurate, relevant, and high-quality content."
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Academic Formatting",
    description: "Automatic adherence to academic standards including APA, MLA, and Chicago styles."
  }
];

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Students</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                LearnCraftify helps you excel in your studies with AI-powered tools designed specifically for college students.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Academic Experience?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of students who are already using LearnCraftify to simplify their academic journey and achieve better results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
              
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">from 2,000+ students</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative animate-fade-in">
              <div className="aspect-[4/3] bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-6 w-3/4 bg-gray-100 rounded"></div>
                  <div className="h-6 w-full bg-gray-100 rounded"></div>
                  <div className="h-6 w-1/2 bg-gray-100 rounded"></div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-100 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-200 rounded-lg transform rotate-12"></div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. See what students like you have to say about LearnCraftify.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Computer Science Major",
                  quote: "LearnCraftify has been a game-changer for my programming assignments. The AI generates perfect code examples that help me understand complex concepts."
                },
                {
                  name: "Samantha Lee",
                  role: "Business Administration",
                  quote: "I use LearnCraftify for all my case study analyses. It follows our school's formatting guidelines perfectly and helps me organize my thoughts clearly."
                },
                {
                  name: "Marcus Williams",
                  role: "Biology Major",
                  quote: "The study materials LearnCraftify generates have helped me ace multiple exams. It simplifies complex topics and creates great study guides."
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover-lift animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="inline-block w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
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

export default Index;
