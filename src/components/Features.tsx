
import { BookOpen, Cpu, GraduationCap, FileText } from 'lucide-react';

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

const Features = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Students</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            SenpAI helps you excel in your studies with AI-powered tools designed specifically for college students.
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
  );
};

export default Features;
