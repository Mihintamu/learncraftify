
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContentTab = () => {
  const { toast } = useToast();
  
  // Content management state
  const [contentFiles, setContentFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Content management functions
  const handleAddContent = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload Complete",
        description: "Content has been uploaded successfully",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Manage Content</h2>
        <Button onClick={handleAddContent} disabled={isUploading}>
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Content
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Repository</CardTitle>
        </CardHeader>
        <CardContent>
          {contentFiles.length > 0 ? (
            <div className="space-y-2">
              {contentFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <span>{file.name}</span>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No content has been uploaded yet. Click "Upload Content" to add study materials.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
