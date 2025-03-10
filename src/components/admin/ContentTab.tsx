
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import our new components
import SubjectSelector from './SubjectSelector';
import ContentFileUpload from './ContentFileUpload';
import ContentFileList from './ContentFileList';

const ContentTab = () => {
  const { toast } = useToast();
  
  // Subject and content management state
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("common");
  const [contentFiles, setContentFiles] = useState<{name: string, size: string, date: string, id: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  
  // Load subjects from Supabase on mount
  useEffect(() => {
    fetchSubjects();
  }, []);
  
  // Fetch content files when selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchContentFiles();
    }
  }, [selectedSubject]);
  
  // Fetch subjects from Supabase
  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSubjects(false);
    }
  };
  
  // Fetch content files from Supabase
  const fetchContentFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('content_files')
        .select('*')
        .eq('subject', selectedSubject)
        .order('upload_date', { ascending: false });
        
      if (error) throw error;
      
      const formattedFiles = data?.map(file => ({
        id: file.id,
        name: file.file_name,
        size: file.file_size,
        date: new Date(file.upload_date).toLocaleDateString(),
      })) || [];
      
      setContentFiles(formattedFiles);
    } catch (error) {
      console.error('Error fetching content files:', error);
      toast({
        title: "Error",
        description: "Failed to load content files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a new file
  const handleFileUploaded = (newFile: {id: string, name: string, size: string, date: string}) => {
    setContentFiles([newFile, ...contentFiles]);
  };
  
  // Handle file deletion
  const handleDeleteFile = (id: string) => {
    setContentFiles(contentFiles.filter(file => file.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg font-medium">Manage Content</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <SubjectSelector
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            subjects={subjects}
            isLoading={isLoadingSubjects}
          />
          
          <ContentFileUpload 
            selectedSubject={selectedSubject}
            onFileUploaded={handleFileUploaded}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedSubject === 'common' ? 'Common Knowledge Base' : `${selectedSubject} Knowledge Base`}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            {contentFiles.length || 0} files
          </div>
        </CardHeader>
        <CardContent>
          <ContentFileList
            contentFiles={contentFiles}
            isLoading={isLoading}
            selectedSubject={selectedSubject}
            onDeleteFile={handleDeleteFile}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
