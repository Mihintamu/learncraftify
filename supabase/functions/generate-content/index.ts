
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import pdfParse from 'npm:pdf-parse'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function createResponse(body: any, status = 200) {
  return new Response(
    JSON.stringify(body),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  )
}

async function handleRequest(req: Request) {
  try {
    // CORS handling
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Validate content-type for POST requests
    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        return createResponse({
          error: `Invalid Content-Type: ${contentType}. Expected application/json`
        }, 400);
      }
    }
    
    // Copy the request to read the body multiple times if needed
    const reqCopy = req.clone();
    
    // Get raw body for logging
    let rawBody = '';
    try {
      rawBody = await reqCopy.text();
      console.log('Raw request body:', rawBody);
      
      if (!rawBody || rawBody.trim() === '') {
        return createResponse({
          error: 'Empty request body'
        }, 400);
      }
    } catch (bodyReadError) {
      console.error('Error reading request body:', bodyReadError);
      return createResponse({
        error: `Failed to read request body: ${bodyReadError.message}`
      }, 400);
    }
    
    // Parse the JSON body
    let requestData;
    try {
      requestData = JSON.parse(rawBody);
      console.log('Parsed request data:', requestData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createResponse({
        error: `Invalid JSON: ${parseError.message}`
      }, 400);
    }
    
    // Validate required fields
    const { subject, topic } = requestData;
    if (!subject || !topic) {
      console.error('Missing required fields:', { subject, topic });
      return createResponse({
        error: 'Subject and topic are required'
      }, 400);
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    console.log(`Fetching content files for subject: ${subject}`)
    const { data: contentFiles, error: filesError } = await supabaseClient
      .from('content_files')
      .select('*')
      .eq('subject', subject)
    
    if (filesError) {
      console.error('Error fetching content files:', filesError)
      return createResponse({
        error: `Error fetching content files: ${filesError.message}`
      }, 400)
    }
    
    if (!contentFiles || contentFiles.length === 0) {
      console.log(`No content files found for subject: ${subject}`)
      return createResponse({
        content: `No content files found for subject: ${subject}.\nPlease ensure content files are uploaded for this subject.`
      })
    }
    
    console.log(`Processing ${contentFiles.length} files`)
    const processedContents = []
    
    for (const file of contentFiles) {
      try {
        console.log(`Downloading file: ${file.file_name}`)
        const { data: fileData, error: downloadError } = await supabaseClient
          .storage
          .from('content_files')
          .download(`${subject}/${file.file_name}`)
        
        if (downloadError) {
          console.error(`Error downloading ${file.file_name}:`, downloadError)
          continue
        }
        
        if (!fileData) {
          console.error(`No data found for file ${file.file_name}`)
          continue
        }
        
        // Handle different file types
        if (file.file_type && file.file_type.toLowerCase() === 'pdf') {
          try {
            const arrayBuffer = await fileData.arrayBuffer()
            const pdfData = await pdfParse(new Uint8Array(arrayBuffer))
            processedContents.push({
              title: file.file_name,
              content: pdfData.text
            })
          } catch (pdfError) {
            console.error(`Error parsing PDF ${file.file_name}:`, pdfError)
          }
        } else if (file.file_type && 
                (file.file_type.toLowerCase() === 'txt' || 
                 file.file_type.toLowerCase() === 'text')) {
          // Handle text files
          const text = await fileData.text()
          processedContents.push({
            title: file.file_name,
            content: text
          })
        } else {
          console.log(`Unsupported file type for ${file.file_name}: ${file.file_type}`)
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.file_name}:`, fileError)
      }
    }
    
    console.log('Generating final content')
    let generatedContent = `# ${topic} (${subject})\n\n`
    
    if (processedContents.length > 0) {
      generatedContent += '## Content\n'
      processedContents.forEach(({ title, content }) => {
        generatedContent += `### From: ${title}\n\n`
        
        // Search for relevant content
        const lowercaseTopic = topic.toLowerCase()
        const paragraphs = content.split('\n\n')
        const relevantParagraphs = paragraphs.filter(p => 
          p.toLowerCase().includes(lowercaseTopic)
        )
        
        if (relevantParagraphs.length > 0) {
          generatedContent += relevantParagraphs.join('\n\n') + '\n\n'
        } else {
          // If no direct match found, include some content anyway
          const someContent = paragraphs.slice(0, 3).join('\n\n')
          generatedContent += someContent + '\n\n'
          generatedContent += '_Note: No direct mentions of the topic found in this document. Showing initial content._\n\n'
        }
      })
    } else {
      generatedContent += '## Note\nNo relevant content found in the available materials.\n'
    }
    
    const { instructions } = requestData
    if (instructions) {
      generatedContent += `\n## Additional Notes\nBased on instructions: ${instructions}\n`
    }
    
    console.log('Successfully generated content')
    return createResponse({ content: generatedContent })
    
  } catch (error: any) {
    console.error('Error processing request:', error);
    return createResponse({ 
      error: `Error processing request: ${error.message}` 
    }, 500);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    return await handleRequest(req)
  } catch (error: any) {
    console.error('Unhandled error:', error);
    return createResponse({ 
      error: `Unhandled error: ${error.message}` 
    }, 500);
  }
})
