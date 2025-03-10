
import { FolderOpen, Loader2 } from 'lucide-react';
import ContentFileItem from './ContentFileItem';

interface ContentFileListProps {
  contentFiles: {
    id: string;
    name: string;
    size: string;
    date: string;
  }[];
  isLoading: boolean;
  selectedSubject: string;
  onDeleteFile: (id: string) => void;
}

const ContentFileList = ({ 
  contentFiles, 
  isLoading, 
  selectedSubject,
  onDeleteFile 
}: ContentFileListProps) => {
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : contentFiles.length > 0 ? (
        <div className="space-y-2">
          {contentFiles.map((file) => (
            <ContentFileItem 
              key={file.id} 
              file={file} 
              onDelete={onDeleteFile} 
            />
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
    </>
  );
};

export default ContentFileList;
