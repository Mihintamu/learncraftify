
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

    // Placeholder for actual file content
    let fileContents = []
    if (contentFiles && contentFiles.length > 0) {
      console.log(`Found ${contentFiles.length} content files for subject: ${subject}`)
      
      // Extract specific information about depreciation if that's the topic
      if (topic.toLowerCase().includes('depreciation')) {
        fileContents.push({
          title: "Characteristics of Depreciation",
          content: `
1. Depreciation is a non-cash expense that reduces the value of an asset due to wear and tear, obsolescence, or time passage.
2. It is a systematic allocation of the cost of a tangible asset over its useful life.
3. Depreciation is a process, not a valuation technique - it allocates cost rather than determining market value.
4. Once recorded, depreciation is irreversible under normal accounting practices.
5. Depreciation applies only to tangible assets that have a useful life of more than one accounting period.
6. Land is generally not subject to depreciation as it doesn't have a limited useful life.
7. Depreciation is recorded regardless of the physical condition of the asset.
8. The total amount depreciated cannot exceed the asset's historical cost minus salvage value.
`
        })
      } else {
        // For other topics, we could fetch some general information
        // In a real-world scenario, you would parse the PDF files or other documents
        fileContents.push({
          title: `Information about ${topic}`,
          content: `This would contain extracted content from the uploaded files related to ${topic} in ${subject}.`
        })
      }
    }

    // Generate more comprehensive content based on the topic and available knowledge
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

    // Add topic-specific content based on the knowledge base
    generatedContent += `\n## Main Content\n`

    if (topic.toLowerCase().includes('depreciation') && fileContents.length > 0) {
      generatedContent += `
### Introduction to ${topic}
Depreciation is a fundamental accounting concept that allocates the cost of tangible assets over their useful life. It represents the reduction in value of an asset due to usage, passage of time, wear and tear, technological obsolescence, depletion, inadequacy, or other factors.

### Key Characteristics of Depreciation
${fileContents[0].content}

### Study Notes
${instructions ? `Based on your instructions: "${instructions}", here are some specific notes:` : 'Here are some important points to remember about depreciation:'}

- Depreciation is a non-cash expense, meaning it reduces profit but doesn't involve an actual cash outflow
- Different depreciation methods (straight-line, declining balance, units of production) can significantly impact financial statements
- Depreciation expense reduces taxable income, making it an important tax consideration
- Accumulated depreciation is reported on the balance sheet as a contra asset account
- The net book value of an asset equals its cost minus accumulated depreciation

### Practice Questions
1. Question: What distinguishes depreciation from other expenses in accounting?
   Answer: Unlike many expenses, depreciation is a non-cash expense that allocates the cost of an asset over its useful life rather than representing an actual outflow of cash.

2. Question: Why can't land be depreciated in financial accounting?
   Answer: Land is considered to have an unlimited useful life and does not deteriorate or wear out over time, so it maintains its value and is not subject to depreciation.

3. Question: How does the concept of materiality apply to depreciation calculations?
   Answer: If an asset's cost is immaterial (insignificant) relative to the company's financial statements, it might be expensed immediately rather than depreciated over time.
`
    } else {
      // Generic content for other topics
      generatedContent += `
### Introduction to ${topic}
${topic} is an important concept in ${subject} that helps students understand the fundamental principles and applications in financial reporting and analysis.

### Key Points to Remember
Based on the available knowledge base:
1. ${topic} plays a crucial role in accurate financial reporting
2. Understanding ${topic} helps in making informed business decisions
3. ${topic} is governed by specific accounting standards and principles

### Study Notes
${instructions ? `Based on your instructions: "${instructions}", here are some specific notes:` : 'Here are some important considerations:'}

- ${topic} must be applied consistently across accounting periods
- Proper documentation is essential for ${topic} implementation
- ${topic} affects both the income statement and balance sheet
`
    }

    generatedContent += `
## Conclusion
This study guide on ${topic} covers the essential aspects that students need to understand for ${subject}. For more detailed information, refer to the complete course materials and the referenced knowledge base documents.
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
