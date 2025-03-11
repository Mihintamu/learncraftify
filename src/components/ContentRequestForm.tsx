
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Loader2, Copy, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContentRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    instructions: '',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.topic) {
      toast.error('Please fill out the subject and topic fields');
      return;
    }
    
    setIsSubmitting(true);
    setGeneratedContent('');
    
    try {
      // Show a loading state
      toast.info('Generating content...');
      const loadingContent = `Generating content for "${formData.topic}" in ${formData.subject}...\n\nPlease wait while we process your request.`;
      setGeneratedContent(loadingContent);
      
      // Prepare the request data
      console.log('Preparing to send request to generate-content with:', {
        subject: formData.subject,
        topic: formData.topic,
        instructions: formData.instructions
      });
      
      // Make the request with a timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 30 seconds')), 30000)
      );
      
      const responsePromise = supabase.functions.invoke('generate-content', {
        body: {
          subject: formData.subject,
          topic: formData.topic,
          instructions: formData.instructions
        }
      });
      
      // Race between the request and the timeout
      const { data, error } = await Promise.race([responsePromise, timeoutPromise]) as any;

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Failed to send a request to the Edge Function: ${error.message}`);
      }
      
      if (data && data.error) {
        console.error('Content generation error:', data.error);
        throw new Error(data.error);
      }
      
      // Update with real content
      if (data && data.content) {
        setGeneratedContent(data.content);
        toast.success('Content generated successfully');
      } else {
        // Fallback content if no data
        setGeneratedContent(`# ${formData.topic}\n\nThis is a placeholder for generated content.\nWe couldn't retrieve specific content for your request.\n\nYour request details:\n- Subject: ${formData.subject}\n- Topic: ${formData.topic}\n- Additional instructions: ${formData.instructions || 'None provided'}`);
        toast.warning('Using placeholder content - no specific content was found');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again later.');
      
      // Provide a more helpful error message
      setGeneratedContent(`Error generating content:\n\n${error.message || 'Unknown error'}\n\nPlease try again later or contact support.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyContent = () => {
    if (!generatedContent) return;
    
    navigator.clipboard.writeText(generatedContent)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };

  const handleDownloadContent = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.subject}_${formData.topic}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Content downloaded');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Request Content</CardTitle>
        <CardDescription>
          Fill out the form below to generate custom study materials or assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Select
              value={formData.subject}
              onValueChange={(value) => handleSelectChange('subject', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
                    <SelectItem value="Financial Accounting">Financial Accounting</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium">
              Topic
            </label>
            <Input
              id="topic"
              name="topic"
              placeholder="Enter the specific topic"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Additional Instructions
            </label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="Provide any specific requirements or formatting instructions"
              rows={5}
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </form>

        {generatedContent && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Generated Content</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyContent}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadContent}
                >
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t px-6 py-4">
        <p className="text-xs text-muted-foreground text-center">
          Content will be generated based on the knowledge base and formatting instructions
        </p>
      </CardFooter>
    </Card>
  );
};

export default ContentRequestForm;
