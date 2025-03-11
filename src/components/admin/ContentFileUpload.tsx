import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatFileSize } from '@/utils/fileUtils';
import { ContentFile } from '@/hooks/useContentFiles';

interface ContentFileUploadProps {
  selectedSubject: string;
  onFileUploaded: (newFile: ContentFile) => void;
}

const ContentFileUpload = ({ selectedSubject, onFileUploaded }: ContentFileUploadProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${selectedSubject}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('content_files')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('content_files')
        .getPublicUrl(filePath);
      
      const { data, error } = await supabase
        .from('content_files')
        .insert([{
          subject: selectedSubject,
          file_name: selectedFile.name,
          file_size: formatFileSize(selectedFile.size),
          file_type: fileExt,
          file_path: publicUrl
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newFile = {
          id: data[0].id,
          name: data[0].file_name,
          size: data[0].file_size,
          date: new Date(data[0].upload_date).toLocaleDateString()
        };
        
        onFileUploaded(newFile);
      }
      
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Upload Complete",
        description: `Content has been uploaded to ${selectedSubject === 'common' ? 'Common Knowledge Base' : selectedSubject + ' Knowledge Base'}`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        id="file-upload"
        type="file"
        className="max-w-60"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
};

export default ContentFileUpload;
