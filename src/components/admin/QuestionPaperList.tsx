import { useState } from 'react';
import { FolderOpen, Loader2, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuestionPaper } from '@/hooks/useQuestionPapers';

interface QuestionPaperListProps {
  papers: QuestionPaper[];
  isLoading: boolean;
  selectedSubject: string;
  onDeletePaper: (id: string) => void;
}

const QuestionPaperList = ({ 
  papers, 
  isLoading, 
  selectedSubject,
  onDeletePaper 
}: QuestionPaperListProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePaper = async (id: string) => {
    try {
      setDeletingId(id);
      
      // First get the file record to get the path
      const { data: fileData, error: fetchError } = await supabase
        .from('question_papers')
        .select('file_path')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Safely check for the file_path property
      if (!fileData || typeof fileData.file_path !== 'string') {
        throw new Error('File path not found');
      }
      
      // Extract the storage file path from the URL
      const storagePath = fileData.file_path.split('/').slice(-2).join('/');
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('question_papers')
        .remove([storagePath]);
        
      if (storageError) {
        console.warn('Could not delete file from storage:', storageError);
        // Continue anyway to delete the database entry
      }
      
      // Delete the file record from the database
      const { error: deleteError } = await supabase
        .from('question_papers')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // Notify parent component to update UI
      onDeletePaper(id);
      
      toast({
        title: "Question Paper Deleted",
        description: "The question paper has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting question paper:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : papers.length > 0 ? (
        <div className="space-y-2">
          {papers.map((paper) => (
            <div key={paper.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium">{paper.name} <span className="ml-2 text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{paper.year}</span></div>
                  <div className="text-xs text-muted-foreground">
                    {paper.size} • Uploaded on {paper.date}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeletePaper(paper.id)}
                disabled={deletingId === paper.id}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                {deletingId === paper.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            No question papers uploaded for {selectedSubject} yet. Upload past exam papers to help analyze exam patterns.
          </p>
        </div>
      )}
    </>
  );
};

export default QuestionPaperList;
