
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ContentRequestFields from './content/ContentRequestFields';
import GeneratedContentDisplay from './content/GeneratedContentDisplay';
import { generateContent, createFallbackContent } from '@/utils/contentGenerationService';
import type { FormData } from './content/ContentRequestFields';

const ContentRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    topic: '',
    instructions: '',
  });

  const handleChange = (name: string, value: string) => {
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
    setError('');
    
    try {
      // Show a loading state
      toast.info('Generating content...');
      const loadingContent = `Generating content for "${formData.topic}" in ${formData.subject}...\n\nPlease wait while we process your request.`;
      setGeneratedContent(loadingContent);
      
      // Log the form data being sent
      console.log('Submitting form data for content generation:', formData);
      
      // Generate content
      const result = await generateContent({
        subject: formData.subject.trim(),
        topic: formData.topic.trim(),
        instructions: formData.instructions.trim()
      });
      
      if (result.error) {
        console.error('Content generation error:', result.error);
        setError(result.error);
        toast.error('Error generating content');
      } else {
        console.log('Content generated successfully');
        toast.success('Content generated successfully');
      }
      
      // Check if we have content, otherwise use fallback
      if (result.content) {
        setGeneratedContent(result.content);
      } else {
        console.warn('Using fallback content');
        setGeneratedContent(createFallbackContent(formData));
      }
      
    } catch (err: any) {
      console.error('Unexpected error during content generation:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setGeneratedContent(createFallbackContent(formData));
      toast.error('Failed to generate content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError('');
    // Create a proper synthetic FormEvent
    const syntheticEvent = {
      preventDefault: () => {},
      target: null,
      currentTarget: null,
      bubbles: false,
      cancelable: false,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      timeStamp: Date.now(),
      type: 'submit',
    } as React.FormEvent;
    
    handleSubmit(syntheticEvent);
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
        <ContentRequestFields 
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <GeneratedContentDisplay 
          content={generatedContent}
          error={error}
          onRetry={handleRetry}
        />
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
