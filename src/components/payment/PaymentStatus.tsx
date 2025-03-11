
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'processing';
  message?: string;
  orderId?: string;
}

export const PaymentStatus = ({ status, message, orderId }: PaymentStatusProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      {status === 'success' && (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Payment Successful!</h2>
          <p className="text-muted-foreground mt-2">
            {message || 'Your payment has been processed successfully.'}
          </p>
          {orderId && (
            <p className="text-sm mt-2">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <div className="mt-6 flex gap-4">
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </>
      )}
      
      {status === 'failed' && (
        <>
          <XCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Payment Failed</h2>
          <p className="text-muted-foreground mt-2">
            {message || 'There was an issue processing your payment.'}
          </p>
          <div className="mt-6 flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/checkout">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </>
      )}
      
      {status === 'processing' && (
        <>
          <Loader2 className="h-16 w-16 text-blue-500 mb-4 animate-spin" />
          <h2 className="text-2xl font-bold tracking-tight">Processing Payment</h2>
          <p className="text-muted-foreground mt-2">
            {message || 'Please wait while we process your payment.'}
          </p>
        </>
      )}
    </div>
  );
};
