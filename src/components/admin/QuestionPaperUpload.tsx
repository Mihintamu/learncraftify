import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatFileSize } from '@/utils/fileUtils';
import { QuestionPaper } from '@/hooks/useQuestionPapers';

interface QuestionPaperUploadProps {
  selectedSubject: string;
  onPaperUploaded: (newPaper: QuestionPaper) => void;
}

interface QuestionPaperInsertResult {
  id: string;
  file_name: string;
  year: string;
  file_size: string;
  upload_date: string;
  [key: string]: any; // Allow for other properties
}

const QuestionPaperUpload = ({ selectedSubject, onPaperUploaded }: QuestionPaperUploadProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [year, setYear] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a question paper to upload",
        variant: "destructive",
      });
      return;
    }

    if (!year) {
      toast({
        title: "Year not specified",
        description: "Please specify the year of the question paper",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${selectedSubject}/papers/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('question_papers')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('question_papers')
        .getPublicUrl(filePath);
      
      const { data, error } = await supabase
        .from('question_papers')
        .insert([{
          subject: selectedSubject,
          file_name: selectedFile.name,
          file_size: formatFileSize(selectedFile.size),
          file_type: fileExt,
          file_path: publicUrl,
          year: year
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const paperData = data[0] as QuestionPaperInsertResult;
        
        const newPaper = {
          id: paperData.id,
          name: paperData.file_name,
          year: paperData.year,
          size: paperData.file_size,
          date: new Date(paperData.upload_date).toLocaleDateString()
        };
        
        onPaperUploaded(newPaper);
      } else {
        throw new Error('No data returned after insert');
      }
      
      setSelectedFile(null);
      setYear("");
      const fileInput = document.getElementById('paper-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast({
        title: "Upload Complete",
        description: `Question paper for ${year} has been uploaded to ${selectedSubject}`,
      });
    } catch (error) {
      console.error('Error uploading question paper:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          id="paper-upload"
          type="file"
          className="max-w-60"
          onChange={handleFileChange}
          disabled={isUploading}
          accept=".pdf,.doc,.docx"
        />
        <Input
          type="text"
          placeholder="Year (e.g., 2023)"
          value={year}
          onChange={handleYearChange}
          className="max-w-36"
          disabled={isUploading}
        />
        <Button onClick={handleUpload} disabled={isUploading || !selectedFile || !year}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Paper
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionPaperUpload;
