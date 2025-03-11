
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

// Payment processing utilities to be implemented later
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan') || 'pro';
  const billingInterval = searchParams.get('billing') || 'monthly';
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  // Mock plan data - in a real app, you'd fetch this from your API
  const planDetails = {
    pro: {
      name: 'Pro Plan',
      monthly: '$9.99',
      yearly: '$95.88',
      description: 'Everything you need for academic success'
    },
    teams: {
      name: 'Teams Plan',
      monthly: '$19.99',
      yearly: '$191.88',
      description: 'For study groups and academic teams'
    }
  }[planId as 'pro' | 'teams'] || {
    name: 'Pro Plan',
    monthly: '$9.99',
    yearly: '$95.88',
    description: 'Everything you need for academic success'
  };

  const price = billingInterval === 'yearly' ? planDetails.yearly : planDetails.monthly;

  // Mock checkout function - to be replaced with actual payment gateway
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      toast.success('This is a demo. In production, you would be redirected to complete payment.');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="container max-w-4xl px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your purchase to get started with LearnCraftify
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-3">
              <form onSubmit={handleCheckout} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      We'll create an account for you if you don't have one yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Select your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                      This is a placeholder for the payment form. In a real implementation, you would integrate with a payment
                      gateway like Stripe, PayPal, or another provider of your choice.
                    </p>
                    
                    {/* Placeholder for payment selection component */}
                    <div className="border rounded-md p-4">
                      <PaymentMethodSelector />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : `Pay ${price}`}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{planDetails.name}</span>
                    <span>{price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Billing interval</span>
                    <span className="capitalize">{billingInterval}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Features</span>
                    <span>All features included</span>
                  </div>
                  
                  <div className="h-px bg-border my-2"></div>
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{price}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">100% Secure Transaction</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your payment information is encrypted and never stored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
