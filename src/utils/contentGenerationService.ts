
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
  
  // Validate request data before sending
  if (!requestData.subject || !requestData.topic) {
    const errorMsg = 'Subject and topic are required fields';
    console.error(errorMsg, requestData);
    return { 
      content: `Error: ${errorMsg}`,
      error: errorMsg
    };
  }
  
  try {
    // Create a properly formatted JSON string to send
    const requestBody = JSON.stringify(requestData);
    console.log('Sending request to Edge Function with body:', requestBody);
    
    // Ensure we're sending a properly formatted request
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Received response:', { data, error });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge Function error: ${error.message || JSON.stringify(error)}`);
    }

    if (!data) {
      throw new Error('No data received from Edge Function');
    }

    if ('error' in data) {
      throw new Error(data.error);
    }

    if (!('content' in data) || typeof data.content !== 'string') {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Edge Function');
    }

    return { content: data.content };
    
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    let errorMessage = 'Failed to generate content. ';
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      errorMessage += 'Network error - please check your connection.';
    } else if (error.message?.includes('timeout')) {
      errorMessage += 'Request timed out - please try again.';
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
