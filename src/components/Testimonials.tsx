
import { Star, Lightbulb, Brain, Target, Award } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Computer Science Major",
    quote: "SenpAI has been a game-changer for my programming assignments. The AI generates perfect code examples that help me understand complex concepts."
  },
  {
    name: "Samantha Lee",
    role: "Business Administration",
    quote: "I use SenpAI for all my case study analyses. It follows our school's formatting guidelines perfectly and helps me organize my thoughts clearly."
  },
  {
    name: "Marcus Williams",
    role: "Biology Major",
    quote: "The study materials SenpAI generates have helped me ace multiple exams. It simplifies complex topics and creates great study guides."
  }
];

const benefits = [
  {
    title: "Enhanced Learning",
    description: "Our AI assistant helps you grasp difficult concepts faster through personalized explanations and examples.",
    icon: <Brain className="h-6 w-6" />
  },
  {
    title: "Time Efficiency",
    description: "Complete assignments in half the time while maintaining high quality and accuracy in your work.",
    icon: <Target className="h-6 w-6" />
  },
  {
    title: "Academic Excellence",
    description: "Students using SenpAI report an average grade improvement of one full letter grade.",
    icon: <Award className="h-6 w-6" />
  },
  {
    title: "Innovative Study Methods",
    description: "Access cutting-edge study techniques tailored to your learning style and course material.",
    icon: <Lightbulb className="h-6 w-6" />
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Students Love SenpAI</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what students like you have to say about SenpAI.
          </p>
        </div>
        
        {/* Testimonials section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
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
        
        {/* Benefits section */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">SenpAI Benefits</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides numerous advantages for students
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover-lift animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
