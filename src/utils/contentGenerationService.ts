
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentGenerationRequest {
  subject: string;
  topic: string;
  instructions: string;
}

export interface ContentGenerationResponse {
  content: string;
  error?: string;
}

export const generateContent = async (
  requestData: ContentGenerationRequest
): Promise<ContentGenerationResponse> => {
  console.log('Preparing to send request to generate-content with:', requestData);
  
  try {
    // Make the request with a timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out after 30 seconds')), 30000)
    );
    
    const responsePromise = supabase.functions.invoke('generate-content', {
      body: requestData
    });
    
    // Race between the request and the timeout
    const result: any = await Promise.race([
      responsePromise.then(res => ({ type: 'response', data: res })),
      timeoutPromise.then(() => ({ type: 'timeout' }))
    ]);
    
    if (result.type === 'timeout') {
      throw new Error('Request timed out after 30 seconds. The server might be busy.');
    }
    
    // Check if result has data property (when it's the response type)
    if (result.type === 'response' && result.data) {
      const { data, error } = result.data;

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Failed to send a request to the Edge Function: ${error.message || error}`);
      }
      
      if (data && data.error) {
        console.error('Content generation error:', data.error);
        throw new Error(data.error);
      }
      
      // Return the generated content
      if (data && data.content) {
        return { content: data.content };
      }
    }
    
    // Fallback content if no proper data was returned
    return { 
      content: createFallbackContent(requestData),
      error: 'No specific content was found'
    };
  } catch (error: any) {
    console.error('Error generating content:', error);
    return { 
      content: `Error generating content:\n\n${error.message || 'Unknown error'}\n\nPlease try again later or contact support.`,
      error: error.message || 'Unknown error occurred'
    };
  }
};

export const createFallbackContent = (requestData: ContentGenerationRequest): string => {
  return `# ${requestData.topic}\n\nThis is a placeholder for generated content.\nWe couldn't retrieve specific content for your request.\n\nYour request details:\n- Subject: ${requestData.subject}\n- Topic: ${requestData.topic}\n- Additional instructions: ${requestData.instructions || 'None provided'}`;
};
