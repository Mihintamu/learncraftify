
import { ChevronLeft, Cpu, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SettingsHeaderProps {
  isSaving: boolean;
  isLoading: boolean;
  onSave: () => void;
}

const SettingsHeader = ({ isSaving, isLoading, onSave }: SettingsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500 text-white p-1 rounded">
              <Cpu className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold">SenpAI</span>
          </div>
        </div>
        <Button 
          onClick={onSave} 
          disabled={isSaving || isLoading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </header>
  );
};

export default SettingsHeader;
