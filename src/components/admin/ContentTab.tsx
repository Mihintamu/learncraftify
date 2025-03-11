
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our components
import SubjectSelector from './SubjectSelector';
import ContentFileUpload from './ContentFileUpload';
import ContentFileList from './ContentFileList';
import QuestionPaperUpload from './QuestionPaperUpload';
import QuestionPaperList from './QuestionPaperList';

const ContentTab = () => {
  const { toast } = useToast();
  
  // Subject and content management state
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("common");
  const [contentFiles, setContentFiles] = useState<{name: string, size: string, date: string, id: string}[]>([]);
  const [questionPapers, setQuestionPapers] = useState<{id: string, name: string, year: string, size: string, date: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPapersLoading, setIsPapersLoading] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("content");
  
  // Load subjects from Supabase on mount
  useEffect(() => {
    fetchSubjects();
  }, []);
  
  // Fetch content files when selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchContentFiles();
      fetchQuestionPapers();
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
  
  // Fetch question papers from Supabase
  const fetchQuestionPapers = async () => {
    try {
      setIsPapersLoading(true);
      const { data, error } = await supabase
        .from('question_papers')
        .select('*')
        .eq('subject', selectedSubject)
        .order('year', { ascending: false });
        
      if (error) throw error;
      
      const formattedPapers = data?.map(paper => ({
        id: paper.id,
        name: paper.file_name,
        year: paper.year,
        size: paper.file_size,
        date: new Date(paper.upload_date).toLocaleDateString(),
      })) || [];
      
      setQuestionPapers(formattedPapers);
    } catch (error) {
      console.error('Error fetching question papers:', error);
      toast({
        title: "Error",
        description: "Failed to load question papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPapersLoading(false);
    }
  };
  
  // Handle adding a new file
  const handleFileUploaded = (newFile: {id: string, name: string, size: string, date: string}) => {
    setContentFiles([newFile, ...contentFiles]);
  };
  
  // Handle adding a new question paper
  const handlePaperUploaded = (newPaper: {id: string, name: string, year: string, size: string, date: string}) => {
    setQuestionPapers([newPaper, ...questionPapers]);
  };
  
  // Handle file deletion
  const handleDeleteFile = (id: string) => {
    setContentFiles(contentFiles.filter(file => file.id !== id));
  };
  
  // Handle question paper deletion
  const handleDeletePaper = (id: string) => {
    setQuestionPapers(questionPapers.filter(paper => paper.id !== id));
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
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="content">Study Materials</TabsTrigger>
          <TabsTrigger value="papers">Question Papers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <ContentFileUpload 
            selectedSubject={selectedSubject}
            onFileUploaded={handleFileUploaded}
          />
          
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
        </TabsContent>
        
        <TabsContent value="papers" className="space-y-4">
          <QuestionPaperUpload
            selectedSubject={selectedSubject}
            onPaperUploaded={handlePaperUploaded}
          />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedSubject === 'common' ? 'Common Question Papers' : `${selectedSubject} Question Papers`}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                {questionPapers.length || 0} papers
              </div>
            </CardHeader>
            <CardContent>
              <QuestionPaperList
                papers={questionPapers}
                isLoading={isPapersLoading}
                selectedSubject={selectedSubject}
                onDeletePaper={handleDeletePaper}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentTab;
