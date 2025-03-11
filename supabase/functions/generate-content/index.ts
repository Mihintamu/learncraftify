
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    const { subject, topic, instructions } = await req.json()

    console.log('Received request for content generation:', { subject, topic, instructions })

    if (!subject || !topic) {
      return new Response(
        JSON.stringify({ error: 'Subject and topic are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Fetch content files for the subject
    const { data: contentFiles, error: filesError } = await supabaseClient
      .from('content_files')
      .select('*')
      .eq('subject', subject)

    if (filesError) {
      console.error('Error fetching content files:', filesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subject content' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Generate the content
    // Currently a placeholder, would normally use an AI model with the subject data
    let generatedContent = `# ${topic} (${subject})

## Overview
This is a comprehensive study guide on ${topic} for ${subject} students.

`

    // Add information about the files we found (or didn't find)
    if (contentFiles && contentFiles.length > 0) {
      generatedContent += `## References
This content was generated using ${contentFiles.length} reference materials from the knowledge base.\n\n`

      // Add file names as references
      contentFiles.forEach((file, index) => {
        generatedContent += `${index + 1}. ${file.file_name}\n`
      })
    } else {
      generatedContent += `\nNote: No specific reference materials were found for this subject. This content is generated based on general knowledge.\n`
    }

    // Add topic-specific content (placeholder)
    generatedContent += `
## Main Content

### Introduction to ${topic}
${topic} is an important concept in ${subject} that helps students understand the fundamental principles and applications.

### Key Points to Remember
1. First key point about ${topic}
2. Second key point about ${topic}
3. Third key point about ${topic}

### Study Notes
${instructions ? `Based on your instructions: "${instructions}", here are some specific notes:` : 'Here are some general notes:'}

- Note 1: Important concept related to ${topic}
- Note 2: Common applications of ${topic}
- Note 3: How ${topic} relates to other topics in ${subject}

### Practice Questions
1. Question: What is the primary purpose of ${topic} in ${subject}?
   Answer: The primary purpose is to provide a framework for understanding related concepts.

2. Question: How does ${topic} apply in real-world scenarios?
   Answer: ${topic} applies in various scenarios including [example applications].

## Conclusion
This study guide on ${topic} covers the essential aspects that students need to understand. For more detailed information, refer to the complete course materials.
`

    // Return the generated content
    return new Response(
      JSON.stringify({
        content: generatedContent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
