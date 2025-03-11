
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContentFileUpload from './ContentFileUpload';
import ContentFileList from './ContentFileList';
import { ContentFile } from '@/hooks/useContentFiles';

interface ContentFilesSectionProps {
  selectedSubject: string;
  contentFiles: ContentFile[];
  isLoading: boolean;
  onFileUploaded: (newFile: ContentFile) => void;
  onDeleteFile: (id: string) => void;
}

const ContentFilesSection = ({
  selectedSubject,
  contentFiles,
  isLoading,
  onFileUploaded,
  onDeleteFile
}: ContentFilesSectionProps) => {
  return (
    <>
      <ContentFileUpload 
        selectedSubject={selectedSubject}
        onFileUploaded={onFileUploaded}
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
            onDeleteFile={onDeleteFile}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ContentFilesSection;
