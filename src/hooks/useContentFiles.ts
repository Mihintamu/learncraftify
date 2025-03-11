
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ContentFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

export function useContentFiles(selectedSubject: string) {
  const { toast } = useToast();
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedSubject) {
      fetchContentFiles();
    }
  }, [selectedSubject]);

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

  const handleFileUploaded = (newFile: ContentFile) => {
    setContentFiles([newFile, ...contentFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setContentFiles(contentFiles.filter(file => file.id !== id));
  };

  return {
    contentFiles,
    isLoading,
    handleFileUploaded,
    handleDeleteFile
  };
}
