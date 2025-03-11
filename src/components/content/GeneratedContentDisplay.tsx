
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContentDisplayProps {
  content: string;
  error: string;
  onRetry: () => void;
}

const GeneratedContentDisplay = ({ 
  content, 
  error, 
  onRetry 
}: GeneratedContentDisplayProps) => {
  
  const handleCopyContent = () => {
    if (!content) return;
    
    navigator.clipboard.writeText(content)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };

  const handleDownloadContent = () => {
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Use a safe filename based on first line of content
    const firstLine = content.split('\n')[0].replace(/[^a-z0-9]/gi, '_').slice(0, 30);
    a.download = `${firstLine || 'generated_content'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Content downloaded');
  };

  if (!content && !error) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-md font-medium text-red-800">Error occurred</h3>
          </div>
          <p className="text-sm text-red-700">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      )}

      {content && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generated Content</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyContent}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadContent}
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {content}
          </div>
        </>
      )}
    </div>
  );
};

export default GeneratedContentDisplay;
