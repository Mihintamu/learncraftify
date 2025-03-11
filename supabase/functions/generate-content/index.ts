
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
    // Log request method and headers for debugging
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    // Validate content-type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      console.error('Invalid content-type:', contentType);
      return createResponse({
        error: `Invalid Content-Type: ${contentType}. Expected application/json`
      }, 400);
    }

    // Get the request body as text first for debugging
    let requestBodyText: string;
    try {
      requestBodyText = await req.text();
      console.log('Raw request body length:', requestBodyText?.length);
      console.log('Raw request body:', requestBodyText);
      
      if (!requestBodyText || requestBodyText.trim() === '') {
        console.error('Empty request body');
        return createResponse({
          error: 'Empty request body'
        }, 400);
      }
    } catch (error: any) {
      console.error('Error reading request body as text:', error);
      return createResponse({
        error: `Failed to read request body: ${error.message}`
      }, 400);
    }

    // Parse the body as JSON
    let requestData;
    try {
      requestData = JSON.parse(requestBodyText);
      console.log('Parsed request data:', requestData);
      
      if (!requestData || Object.keys(requestData).length === 0) {
        console.error('Empty JSON object after parsing');
        return createResponse({
          error: 'Empty JSON object after parsing'
        }, 400);
      }
    } catch (error: any) {
      console.error('JSON parse error:', error);
      return createResponse({
        error: `Invalid JSON: ${error.message}`
      }, 400);
    }

    // Check required fields
    const { subject, topic, instructions } = requestData;
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

        if (file.file_type.toLowerCase() === 'pdf') {
          const arrayBuffer = await fileData.arrayBuffer()
          const pdfData = await pdfParse(new Uint8Array(arrayBuffer))
          processedContents.push({
            title: file.file_name,
            content: pdfData.text
          })
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.file_name}:`, fileError)
      }
    }

    console.log('Generating final content')
    let generatedContent = `# ${topic} (${subject})\n\n`
    
    if (processedContents.length > 0) {
      generatedContent += '## Content\n'
      processedContents.forEach(({ content }) => {
        const relevantParagraphs = content
          .split('\n\n')
          .filter(p => p.toLowerCase().includes(topic.toLowerCase()))
          .join('\n\n')
        if (relevantParagraphs) {
          generatedContent += relevantParagraphs + '\n\n'
        }
      })
    } else {
      generatedContent += '## Note\nNo relevant content found in the available materials.\n'
    }

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
