
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface AccessCodeSectionProps {
  currentAccessCode: string;
  onAccessCodeChange: (newCode: string) => void;
}

const AccessCodeSection = ({ currentAccessCode, onAccessCodeChange }: AccessCodeSectionProps) => {
  const { toast } = useToast();
  const [isChangingAccessCode, setIsChangingAccessCode] = useState(false);
  const [newAccessCode, setNewAccessCode] = useState('');
  const [confirmAccessCode, setConfirmAccessCode] = useState('');

  const handleChangeAccessCode = () => {
    setIsChangingAccessCode(true);
  };
  
  const submitAccessCodeChange = () => {
    // Validate inputs
    if (!newAccessCode || !confirmAccessCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newAccessCode !== confirmAccessCode) {
      toast({
        title: "Error",
        description: "New access codes do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate processing delay
    setTimeout(() => {
      onAccessCodeChange(newAccessCode);
      setNewAccessCode('');
      setConfirmAccessCode('');
      setIsChangingAccessCode(false);
      
      // Update in localStorage for persistence (in a real app, this would be server-side)
      localStorage.setItem('adminAccessCode', newAccessCode);
      
      toast({
        title: "Access Code Updated",
        description: "Admin access code has been changed successfully",
      });
    }, 1000);
  };
  
  const cancelAccessCodeChange = () => {
    setNewAccessCode('');
    setConfirmAccessCode('');
    setIsChangingAccessCode(false);
  };

  return (
    <div className="border-b pb-6">
      <h3 className="font-medium mb-4">Admin Access</h3>
      
      {isChangingAccessCode ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">New Access Code</label>
            <Input
              type="password"
              value={newAccessCode}
              onChange={(e) => setNewAccessCode(e.target.value)}
              placeholder="Enter new access code"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Confirm Access Code</label>
            <Input
              type="password"
              value={confirmAccessCode}
              onChange={(e) => setConfirmAccessCode(e.target.value)}
              placeholder="Confirm new access code"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={submitAccessCodeChange}>Save Changes</Button>
            <Button variant="outline" onClick={cancelAccessCodeChange}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={handleChangeAccessCode}>
          Change Access Code
        </Button>
      )}
    </div>
  );
};

export default AccessCodeSection;
