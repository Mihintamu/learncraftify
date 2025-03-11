
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our components
import SubjectSelector from './SubjectSelector';
import ContentFilesSection from './ContentFilesSection';
import QuestionPapersSection from './QuestionPapersSection';

// Import custom hooks
import { useSubjects } from '@/hooks/useSubjects';
import { useContentFiles } from '@/hooks/useContentFiles';
import { useQuestionPapers } from '@/hooks/useQuestionPapers';

const ContentTab = () => {
  // State management
  const [selectedSubject, setSelectedSubject] = useState<string>("common");
  const [activeTab, setActiveTab] = useState<string>("content");
  
  // Custom hooks for data fetching and management
  const { subjects, isLoading: isLoadingSubjects } = useSubjects();
  const { 
    contentFiles, 
    isLoading: isLoadingContent, 
    handleFileUploaded, 
    handleDeleteFile 
  } = useContentFiles(selectedSubject);
  
  const { 
    questionPapers, 
    isLoading: isLoadingPapers, 
    handlePaperUploaded, 
    handleDeletePaper 
  } = useQuestionPapers(selectedSubject);

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
          <ContentFilesSection 
            selectedSubject={selectedSubject}
            contentFiles={contentFiles}
            isLoading={isLoadingContent}
            onFileUploaded={handleFileUploaded}
            onDeleteFile={handleDeleteFile}
          />
        </TabsContent>
        
        <TabsContent value="papers" className="space-y-4">
          <QuestionPapersSection
            selectedSubject={selectedSubject}
            questionPapers={questionPapers}
            isLoading={isLoadingPapers}
            onPaperUploaded={handlePaperUploaded}
            onDeletePaper={handleDeletePaper}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentTab;
