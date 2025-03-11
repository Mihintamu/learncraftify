
import { Star } from 'lucide-react';

const testimonials = [
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
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what students like you have to say about LearnCraftify.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
};

export default Testimonials;
