// Import the serve function from Deno standard library
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Import Supabase JS client - using a specific import that's compatible with Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Updated webhook URL as requested by user
const N8N_WEBHOOK_URL = "https://ckproductspace.app.n8n.cloud/webhook/916b0eb7-0da0-4000-86c8-9654d930338f";
const SUPABASE_URL = "https://grouwquojmflxkqlwukz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyb3V3cXVvam1mbHhrcWx3dWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTUyODIsImV4cCI6MjA2MTc3MTI4Mn0.Hp9J1HWhFUPY-xYHKf_mh2ZIMVUQFXlxLFOLYKwKpfs";
// Add service role key for bypassing RLS
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback response generator in case n8n webhook fails
function generateFallbackResponse(articleContext: any, userMessage: string): string {
  // Simple fallback to provide a meaningful response when n8n is unavailable
  const articleTitle = articleContext?.title || 'this article';
  
  return `I'm sorry, I'm currently unable to process your request about "${articleTitle}" due to a technical issue. 
  
Here's what I can tell you:
- Your question was: "${userMessage}"
- This appears to be about "${articleTitle}"

Please try again in a moment, or rephrase your question. Our team is working to restore full functionality as soon as possible.`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userMessage, articleId, userId, sessionId, isVoice = false } = await req.json();
    
    if (!userMessage || !articleId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing request: userId=${userId}, articleId=${articleId}, sessionId=${sessionId}, isVoice=${isVoice}`);
    
    // Create Supabase client using service role to bypass RLS
    const supabase = createClient(
      SUPABASE_URL, 
      SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, // Fall back to anon key if service role key is not available
      {
        auth: { persistSession: false }
      }
    );
    
    // Fetch article content to provide context
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .select('title, content, summary')
      .eq('id', articleId)
      .single();

    if (articleError) {
      console.error('Error fetching article:', articleError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch article context" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully fetched article: ${articleData.title}`);

    // Get previous messages for context (limit to last 10 messages)
    const { data: previousMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('message, role')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (messagesError) {
      console.error('Error fetching previous messages:', messagesError);
      // Continue without previous messages
    } else {
      console.log(`Fetched ${previousMessages?.length || 0} previous messages`);
    }

    // Prepare chat history
    const chatHistory = previousMessages ? previousMessages.map(msg => ({
      role: msg.role,
      content: msg.message
    })) : [];

    // First, save user message to database to ensure it's stored
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        message: userMessage,
        role: 'user',
        is_voice: isVoice
      });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
    } else {
      console.log('Successfully saved user message to database');
    }

    // Prepare data for webhook
    const webhookPayload = {
      userMessage,
      articleContext: {
        title: articleData.title,
        content: articleData.content,
        summary: articleData.summary
      },
      chatHistory,
      sessionId,
      isVoice
    };

    // Updated webhook URL construction
    const webhookUrl = `${N8N_WEBHOOK_URL}?sessionId=${sessionId}`;
    console.log('Sending request to webhook:', webhookUrl);
    
    let assistantMessage;
    let n8nResponseStatus = 0;
    
    try {
      // Send request to webhook
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });
      
      n8nResponseStatus = webhookResponse.status;
      console.log(`Webhook response status: ${n8nResponseStatus}`);

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error(`Error from webhook (status ${webhookResponse.status}):`, errorText);
        
        // Use fallback response instead of failing
        assistantMessage = generateFallbackResponse(articleData, userMessage);
      } else {
        // Try to parse JSON response, fall back to text if not valid JSON
        let responseText = await webhookResponse.text();
        console.log(`Webhook raw response: ${responseText.substring(0, 300)}...`);
        
        try {
          // Try to parse as JSON
          const responseData = JSON.parse(responseText);
          assistantMessage = responseData.message || responseData.response || responseData.answer || 
            "I'm not sure how to respond to that.";
          console.log('Successfully parsed JSON response from webhook');
        } catch (jsonError) {
          console.error('Failed to parse JSON from webhook, using response as plain text');
          // If not valid JSON but has content, use the text response directly
          if (responseText && responseText.length > 5) {
            assistantMessage = responseText;
          } else {
            assistantMessage = generateFallbackResponse(articleData, userMessage);
          }
        }
      }
    } catch (error) {
      console.error('Error communicating with webhook:', error);
      
      // Use fallback response for any network or other errors
      assistantMessage = generateFallbackResponse(articleData, userMessage);
    }

    // Save assistant message to database
    const { error: assistantMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        message: assistantMessage,
        role: 'assistant',
        is_voice: false // Assistant messages are never originally voice
      });

    if (assistantMsgError) {
      console.error('Error saving assistant message:', assistantMsgError);
    } else {
      console.log('Successfully saved assistant message to database');
    }

    // Include webhook status in response for debugging
    return new Response(
      JSON.stringify({ 
        message: assistantMessage, 
        n8nStatus: n8nResponseStatus 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in article-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
