
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Basic features for students getting started',
    features: [
      'Generate up to 5 study notes per month',
      'Basic formatting options',
      'Access to common knowledge base',
      'Export to PDF'
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Everything you need for academic success',
    features: [
      'Generate unlimited study notes',
      'All formatting styles (APA, MLA, Chicago)',
      'Access to all subject knowledge bases',
      'Priority support',
      'Export to PDF, Word, and Google Docs',
      'Citation generator'
    ],
    popular: true,
    buttonText: 'Subscribe Now',
    buttonVariant: 'default' as const
  },
  {
    id: 'teams',
    name: 'Teams',
    price: '$19.99',
    period: 'per month',
    description: 'For study groups and academic teams',
    features: [
      'All Pro features included',
      'Up to 5 team members',
      'Collaborative study notes',
      'Team admin dashboard',
      'Shared knowledge base',
      'API access'
    ],
    popular: false,
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const
  }
];

const Pricing = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const handleSubscription = (planId: string) => {
    if (planId === 'free') {
      navigate('/register');
      return;
    }
    
    // For paid plans, we'd normally redirect to checkout
    // Since we're setting up for manual configuration later,
    // we'll just show a toast message now
    toast.info('Payment gateway not configured yet. This will redirect to checkout in production.');
    
    // In future this would be:
    // navigate(`/checkout?plan=${planId}&billing=${billingInterval}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Choose the plan that's right for your academic journey.
              Cancel anytime.
            </p>
            
            <div className="mt-6 flex items-center space-x-2 rounded-lg border p-1">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-3 py-1 rounded-md ${
                  billingInterval === 'monthly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 ${
                  billingInterval === 'yearly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                Yearly
                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary shadow-lg' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Popular
                  </div>
                )}
                <CardHeader className="flex flex-col space-y-1.5 pb-4">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {billingInterval === 'yearly' 
                        ? plan.id === 'free' 
                          ? '$0' 
                          : `$${(parseFloat(plan.price.replace('$', '')) * 0.8 * 12).toFixed(2)}`
                        : plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {billingInterval === 'yearly' ? '/year' : plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.buttonVariant}
                    size="lg"
                    className="w-full"
                    onClick={() => handleSubscription(plan.id)}
                  >
                    {plan.buttonText}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              FAQ
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
                },
                {
                  q: "Do you offer student discounts?",
                  a: "Yes! Students with a valid .edu email address can get 15% off any paid plan. Contact our support team after signing up to apply the discount."
                },
                {
                  q: "How does the Teams plan work?",
                  a: "The Teams plan allows you to add up to 5 members to collaborate on study materials. The team admin can manage access and permissions for all members."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and Apple Pay. For Teams plans, we also offer invoice payment options."
                },
                {
                  q: "Is my payment information secure?",
                  a: "Yes, we use industry-standard encryption and never store your full credit card details on our servers. All payments are processed securely."
                },
                {
                  q: "Do you offer refunds?",
                  a: "If you're not satisfied with your subscription, contact us within 14 days of payment for a full refund. No questions asked."
                }
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border p-4 text-left">
                  <h3 className="font-medium">{faq.q}</h3>
                  <p className="mt-2 text-sm text-gray-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
