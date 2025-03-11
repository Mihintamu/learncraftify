
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { parse as parsePdf } from 'npm:pdf-parse'

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a response with appropriate headers
function createResponse(body: any, status = 200) {
  return new Response(
    JSON.stringify(body),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  )
}

// Handle request validation and extract request data
async function parseAndValidateRequest(req: Request) {
  try {
    const requestData = await req.json()
    console.log('Received request data:', JSON.stringify(requestData))
    
    const { subject, topic, instructions } = requestData
    
    if (!subject || !topic) {
      console.error('Missing required fields: subject or topic')
      throw new Error('Subject and topic are required')
    }
    
    return { subject, topic, instructions }
  } catch (error) {
    console.error('Error parsing request body:', error)
    throw new Error(`Invalid request format: ${error.message}`)
  }
}

// Create Supabase client with proper authentication
function createSupabaseClient(req: Request) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )
}

// Generate fallback content when no relevant data is found
function generateFallbackContent(subject: string, topic: string, instructions?: string) {
  return `# ${topic} (${subject})

## Overview
This is a study guide on ${topic} for ${subject} students.

## Content
Currently, we don't have specific content for this topic in our knowledge base. 
Please check again later as we continue to expand our library of materials.

## Study Notes
Based on your request for: "${topic}" in "${subject}"
${instructions ? `\nWith additional instructions: "${instructions}"` : ''}

We suggest reviewing general ${subject} materials and focusing on ${topic} concepts.

## Additional Resources
Consider exploring online educational platforms for more information on this topic.
`
}

// Fetch content files from the database
async function fetchContentFiles(supabaseClient: any, subject: string) {
  console.log(`Fetching content files for subject: ${subject}`)
  const { data: contentFiles, error: filesError } = await supabaseClient
    .from('content_files')
    .select('*')
    .eq('subject', subject)

  if (filesError) {
    console.error('Error fetching content files:', filesError)
    throw new Error(`Error fetching content files: ${filesError.message}`)
  }

  if (!contentFiles || contentFiles.length === 0) {
    console.log(`No content files found for subject: ${subject}`)
    throw new Error(`No content files found for subject: ${subject}`)
  }

  console.log(`Found ${contentFiles.length} content files for subject: ${subject}`)
  return contentFiles
}

// Download and parse a single file
async function parseContentFile(supabaseClient: any, subject: string, file: any) {
  try {
    console.log(`Processing file: ${file.file_name}`)
    
    // Download file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('content_files')
      .download(`${subject}/${file.file_name}`)

    if (downloadError) {
      console.error(`Error downloading file ${file.file_name}:`, downloadError)
      return null
    }

    if (!fileData) {
      console.error(`No data found for file ${file.file_name}`)
      return null
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await fileData.arrayBuffer()
    
    // Parse PDF content
    if (file.file_type.toLowerCase() === 'pdf') {
      console.log(`Parsing PDF: ${file.file_name}`)
      try {
        const pdfData = await parsePdf(new Uint8Array(arrayBuffer))
        console.log(`Successfully parsed PDF: ${file.file_name}`)
        return {
          title: file.file_name,
          content: pdfData.text
        }
      } catch (pdfError) {
        console.error(`Error parsing PDF ${file.file_name}:`, pdfError)
        return null
      }
    }
    return null
  } catch (fileError) {
    console.error(`Error processing file ${file.file_name}:`, fileError)
    return null
  }
}

// Extract relevant content based on topic
function extractRelevantContent(fileContents: any[], searchTopic: string) {
  let relevantContent = ''
  
  // Search through parsed content for relevant information
  for (const file of fileContents) {
    const contentLower = file.content.toLowerCase()
    if (contentLower.includes(searchTopic)) {
      // Extract paragraphs containing the topic
      const paragraphs = file.content.split('\n\n')
      const relevantParagraphs = paragraphs.filter(p => 
        p.toLowerCase().includes(searchTopic)
      )
      relevantContent += relevantParagraphs.join('\n\n') + '\n\n'
    }
  }
  
  return relevantContent
}

// Generate study guide content
function generateStudyGuide(
  subject: string, 
  topic: string, 
  contentFiles: any[], 
  relevantContent: string, 
  instructions?: string
) {
  let generatedContent = `# ${topic} (${subject})

## Overview
This is a comprehensive study guide on ${topic} for ${subject} students.

## References
This content was generated using ${contentFiles.length} reference materials from the knowledge base.\n\n`

  // Add file names as references
  contentFiles.forEach((file, index) => {
    generatedContent += `${index + 1}. ${file.file_name}\n`
  })

  // Add extracted content
  generatedContent += `\n## Main Content\n`
  
  if (relevantContent) {
    generatedContent += `\n### Key Concepts\n${relevantContent}\n`
  } else {
    generatedContent += `\nNo specific content found for this topic in the knowledge base. Please ensure relevant materials are uploaded.\n`
  }

  // Add study notes based on instructions
  generatedContent += `\n### Study Notes\n`
  if (instructions) {
    generatedContent += `Based on your instructions: "${instructions}", here are some key points:\n\n`
  }
  
  // Extract key points from relevant content
  const keyPoints = relevantContent
    ? relevantContent
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => `- ${line.trim()}`)
        .join('\n')
    : '- No specific points found in the knowledge base for this topic.'
  
  generatedContent += keyPoints

  // Add conclusion
  generatedContent += `\n\n## Conclusion
This study guide provides an overview of ${topic} in ${subject}. For more detailed information, please refer to the referenced materials.`

  return generatedContent
}

// Main handler function for content generation
async function handleContentGeneration(req: Request) {
  try {
    const { subject, topic, instructions } = await parseAndValidateRequest(req)
    const supabaseClient = createSupabaseClient(req)
    
    try {
      // Fetch content files for the subject
      const contentFiles = await fetchContentFiles(supabaseClient, subject)
      
      // Parse and extract content from files
      const fileContentsPromises = contentFiles.map(file => 
        parseContentFile(supabaseClient, subject, file)
      )
      
      const fileContentsWithNull = await Promise.all(fileContentsPromises)
      const fileContents = fileContentsWithNull.filter(content => content !== null)

      // Check if we have any parsed content
      if (fileContents.length === 0) {
        console.log('No files were successfully parsed')
        return createResponse({ content: generateFallbackContent(subject, topic, instructions) })
      }

      // Extract relevant content based on topic
      const searchTopic = topic.toLowerCase()
      const relevantContent = extractRelevantContent(fileContents, searchTopic)
      
      // Generate the study guide
      const generatedContent = generateStudyGuide(
        subject, 
        topic, 
        contentFiles, 
        relevantContent, 
        instructions
      )

      console.log('Successfully generated content')
      return createResponse({ content: generatedContent })
      
    } catch (contentError) {
      console.error('Error processing content:', contentError)
      // Return fallback content on error
      return createResponse({ 
        content: generateFallbackContent(subject, topic, instructions)
      })
    }
  } catch (error) {
    console.error('Error in request processing:', error)
    return createResponse({ 
      error: error.message || 'An unknown error occurred' 
    }, 400)
  }
}

// Main edge function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    return await handleContentGeneration(req)
  } catch (error) {
    console.error('Unhandled error in Edge Function:', error)
    return createResponse({ 
      error: error.message || 'An unknown error occurred' 
    }, 500)
  }
})
