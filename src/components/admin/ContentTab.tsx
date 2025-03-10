
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, FileText, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ContentTab = () => {
  const { toast } = useToast();
  
  // Subject and content management state
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("common");
  const [contentFiles, setContentFiles] = useState<{[key: string]: {name: string, size: string, date: string}[]}>(
    { common: [] }
  );
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Load subjects from localStorage on mount
  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      const parsedSubjects = JSON.parse(storedSubjects);
      setSubjects(parsedSubjects);
      
      // Initialize content files for each subject
      const initialContentFiles = { common: [] };
      parsedSubjects.forEach((subject: string) => {
        initialContentFiles[subject] = [];
      });
      
      // Try to load existing content files from localStorage
      const storedContentFiles = localStorage.getItem('contentFiles');
      if (storedContentFiles) {
        setContentFiles(JSON.parse(storedContentFiles));
      } else {
        setContentFiles(initialContentFiles);
      }
    }
  }, []);
  
  // Save content files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contentFiles', JSON.stringify(contentFiles));
  }, [contentFiles]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle content upload
  const handleAddContent = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Add the file to the selected subject's content files
      const newFile = {
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        date: new Date().toLocaleDateString()
      };
      
      setContentFiles(prev => ({
        ...prev,
        [selectedSubject]: [...(prev[selectedSubject] || []), newFile]
      }));
      
      setIsUploading(false);
      setSelectedFile(null);
      
      // Reset the file input by clearing its value
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Upload Complete",
        description: `Content has been uploaded to ${selectedSubject === 'common' ? 'Common Knowledge Base' : selectedSubject + ' Knowledge Base'}`,
      });
    }, 1500);
  };
  
  // Format file size in KB or MB
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Handle file deletion
  const handleDeleteFile = (fileName: string) => {
    setContentFiles(prev => ({
      ...prev,
      [selectedSubject]: prev[selectedSubject].filter(file => file.name !== fileName)
    }));
    
    toast({
      title: "File Deleted",
      description: `"${fileName}" has been removed from ${selectedSubject === 'common' ? 'Common Knowledge Base' : selectedSubject + ' Knowledge Base'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg font-medium">Manage Content</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Knowledge Base" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common Knowledge Base</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              id="file-upload"
              type="file"
              className="max-w-60"
              onChange={handleFileChange}
            />
            <Button onClick={handleAddContent} disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedSubject === 'common' ? 'Common Knowledge Base' : `${selectedSubject} Knowledge Base`}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            {contentFiles[selectedSubject]?.length || 0} files
          </div>
        </CardHeader>
        <CardContent>
          {contentFiles[selectedSubject]?.length > 0 ? (
            <div className="space-y-2">
              {contentFiles[selectedSubject].map((file, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.size} • Uploaded on {file.date}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteFile(file.name)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {selectedSubject === 'common' 
                  ? 'No common instructions uploaded yet. Upload files to help guide content generation.'
                  : `No content uploaded for ${selectedSubject} yet. Upload study materials for this subject.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
