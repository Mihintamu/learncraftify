
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

type RaceResult = 
  | { type: 'response'; data: { data: ContentGenerationResponse; error: any } }
  | { type: 'timeout' };

export const generateContent = async (
  requestData: ContentGenerationRequest
): Promise<ContentGenerationResponse> => {
  console.log('Preparing to send request to generate-content with:', requestData);
  
  try {
    // Make the request with a timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out after 30 seconds')), 30000)
    );
    
    const functionPromise = supabase.functions.invoke('generate-content', {
      body: requestData
    });

    console.log('Sending request to Edge Function...');
    
    const response = await Promise.race([
      functionPromise.then(res => ({ type: 'response', data: res } as RaceResult)),
      timeoutPromise
    ]);

    console.log('Received response from Edge Function:', response);
    
    // Properly type check the response
    if ('type' in response && response.type === 'response') {
      const { data, error } = response.data;

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge Function error: ${error.message || JSON.stringify(error)}`);
      }
      
      if (!data) {
        throw new Error('No data received from Edge Function');
      }
      
      if (typeof data.content !== 'string') {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from Edge Function');
      }
      
      return { content: data.content };
    }
    
    throw new Error('Unexpected response format');
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    // More specific error messages based on the error type
    let errorMessage = 'Failed to generate content. ';
    if (error.message?.includes('Failed to fetch')) {
      errorMessage += 'Network error - please check your connection.';
    } else if (error.message?.includes('timeout')) {
      errorMessage += 'Request timed out - please try again.';
    } else if (error.statusText) {
      errorMessage += `Server error: ${error.statusText}`;
    } else {
      errorMessage += error.message || 'Unknown error occurred';
    }
    
    return { 
      content: `Error: ${errorMessage}\n\nPlease try again later or contact support if the issue persists.`,
      error: errorMessage
    };
  }
};

export const createFallbackContent = (requestData: ContentGenerationRequest): string => {
  return `# ${requestData.topic}\n\nThis is a placeholder for generated content.\nWe couldn't retrieve specific content for your request.\n\nYour request details:\n- Subject: ${requestData.subject}\n- Topic: ${requestData.topic}\n- Additional instructions: ${requestData.instructions || 'None provided'}`;
};
