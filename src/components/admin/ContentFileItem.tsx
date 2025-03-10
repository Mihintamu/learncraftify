
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentFileItemProps {
  file: {
    id: string;
    name: string;
    size: string;
    date: string;
  };
  onDelete: (id: string) => void;
}

const ContentFileItem = ({ file, onDelete }: ContentFileItemProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteFile = async () => {
    try {
      setIsDeleting(true);
      
      // First get the file record to get the path
      const { data: fileData, error: fetchError } = await supabase
        .from('content_files')
        .select('file_path')
        .eq('id', file.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Extract the storage file path from the URL
      const storagePath = fileData.file_path.split('/').slice(-2).join('/');
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('content_files')
        .remove([storagePath]);
        
      if (storageError) {
        console.warn('Could not delete file from storage:', storageError);
        // Continue anyway to delete the database entry
      }
      
      // Delete the file record from the database
      const { error: deleteError } = await supabase
        .from('content_files')
        .delete()
        .eq('id', file.id);
        
      if (deleteError) throw deleteError;
      
      // Notify parent component to update UI
      onDelete(file.id);
      
      toast({
        title: "File Deleted",
        description: `"${file.name}" has been removed successfully`,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
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
        onClick={handleDeleteFile}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ContentFileItem;
