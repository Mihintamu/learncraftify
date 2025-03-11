
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { parse as parsePdf } from 'npm:pdf-parse'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Edge function called: generate-content')
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse request body
    const requestData = await req.json()
    const { subject, topic, instructions } = requestData
    
    console.log('Received request with data:', requestData)

    if (!subject || !topic) {
      console.error('Missing required fields: subject or topic')
      return new Response(
        JSON.stringify({ error: 'Subject and topic are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Generate a fallback content in case we can't find any relevant materials
    const fallbackContent = `# ${topic} (${subject})

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

    try {
      // Fetch content files for the subject
      console.log(`Fetching content files for subject: ${subject}`)
      const { data: contentFiles, error: filesError } = await supabaseClient
        .from('content_files')
        .select('*')
        .eq('subject', subject)

      if (filesError) {
        console.error('Error fetching content files:', filesError)
        // Return fallback content instead of failing
        return new Response(
          JSON.stringify({ content: fallbackContent }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      if (!contentFiles || contentFiles.length === 0) {
        console.log(`No content files found for subject: ${subject}`)
        return new Response(
          JSON.stringify({ content: fallbackContent }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      console.log(`Found ${contentFiles.length} content files for subject: ${subject}`)
      
      // Parse and extract content from files
      let fileContents = []
      for (const file of contentFiles) {
        try {
          console.log(`Processing file: ${file.file_name}`)
          
          // Download file from storage
          const { data: fileData, error: downloadError } = await supabaseClient
            .storage
            .from('content_files')
            .download(`${subject}/${file.file_name}`)

          if (downloadError) {
            console.error(`Error downloading file ${file.file_name}:`, downloadError)
            continue
          }

          if (!fileData) {
            console.error(`No data found for file ${file.file_name}`)
            continue
          }

          // Convert file to ArrayBuffer
          const arrayBuffer = await fileData.arrayBuffer()
          
          // Parse PDF content
          if (file.file_type.toLowerCase() === 'pdf') {
            console.log(`Parsing PDF: ${file.file_name}`)
            try {
              const pdfData = await parsePdf(new Uint8Array(arrayBuffer))
              fileContents.push({
                title: file.file_name,
                content: pdfData.text
              })
              console.log(`Successfully parsed PDF: ${file.file_name}`)
            } catch (pdfError) {
              console.error(`Error parsing PDF ${file.file_name}:`, pdfError)
            }
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.file_name}:`, fileError)
        }
      }

      // Check if we have any parsed content
      if (fileContents.length === 0) {
        console.log('No files were successfully parsed')
        return new Response(
          JSON.stringify({ content: fallbackContent }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      // Prepare content based on parsed files and topic
      let relevantContent = ''
      const searchTopic = topic.toLowerCase()
      
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

      // Generate the study guide content
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

      console.log('Successfully generated content')
      
      // Return the generated content
      return new Response(
        JSON.stringify({ content: generatedContent }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (contentError) {
      console.error('Error processing content:', contentError)
      // Return fallback content on error
      return new Response(
        JSON.stringify({ content: fallbackContent }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Error in Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
