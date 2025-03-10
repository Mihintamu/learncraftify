
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, FileText, FolderOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const ContentTab = () => {
  const { toast } = useToast();
  
  // Subject and content management state
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("common");
  const [contentFiles, setContentFiles] = useState<{name: string, size: string, date: string, id: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle content upload
  const handleAddContent = async () => {
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
      // Generate a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${selectedSubject}/${fileName}`;
      
      // Upload file to storage bucket
      const { error: uploadError } = await supabase.storage
        .from('content_files')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('content_files')
        .getPublicUrl(filePath);
      
      // Add file metadata to the database
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
      
      // Add the new file to the current list
      if (data && data.length > 0) {
        const newFile = {
          id: data[0].id,
          name: data[0].file_name,
          size: data[0].file_size,
          date: new Date(data[0].upload_date).toLocaleDateString()
        };
        
        setContentFiles([newFile, ...contentFiles]);
      }
      
      // Reset the file input
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
  
  // Format file size in KB or MB
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Handle file deletion
  const handleDeleteFile = async (id: string, fileName: string) => {
    try {
      // First get the file record to get the path
      const { data: fileData, error: fetchError } = await supabase
        .from('content_files')
        .select('file_path')
        .eq('id', id)
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
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // Update the UI
      setContentFiles(contentFiles.filter(file => file.id !== id));
      
      toast({
        title: "File Deleted",
        description: `"${fileName}" has been removed from ${selectedSubject === 'common' ? 'Common Knowledge Base' : selectedSubject + ' Knowledge Base'}`,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg font-medium">Manage Content</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={isLoadingSubjects}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Knowledge Base" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common Knowledge Base</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              id="file-upload"
              type="file"
              className="max-w-60"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Button onClick={handleAddContent} disabled={isUploading || !selectedFile}>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contentFiles.length > 0 ? (
            <div className="space-y-2">
              {contentFiles.map((file) => (
                <div key={file.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
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
                    onClick={() => handleDeleteFile(file.id, file.name)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
