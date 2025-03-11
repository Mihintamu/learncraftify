
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
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
        
        <PreviewCard />
      </div>
    </section>
  );
};

const PreviewCard = () => {
  return (
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
  );
};

export default CallToAction;
