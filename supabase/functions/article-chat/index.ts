
// Import the serve function from Deno standard library
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Import Supabase JS client - using a specific import that's compatible with Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const N8N_WEBHOOK_URL = "https://ckproductspace.app.n8n.cloud/webhook-test/916b0eb7-0da0-4000-86c8-9654d930338f";
const SUPABASE_URL = "https://grouwquojmflxkqlwukz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyb3V3cXVvam1mbHhrcWx3dWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTUyODIsImV4cCI6MjA2MTc3MTI4Mn0.Hp9J1HWhFUPY-xYHKf_mh2ZIMVUQFXlxLFOLYKwKpfs";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userMessage, articleId, userId, sessionId } = await req.json();
    
    if (!userMessage || !articleId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client using the Deno-compatible approach
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
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
    }

    // Prepare chat history
    const chatHistory = previousMessages ? previousMessages.map(msg => ({
      role: msg.role,
      content: msg.message
    })) : [];

    // Prepare data for n8n
    const n8nPayload = {
      userMessage,
      articleContext: {
        title: articleData.title,
        content: articleData.content,
        summary: articleData.summary
      },
      chatHistory
    };

    console.log('Sending request to n8n webhook:', N8N_WEBHOOK_URL);
    
    // Send request to n8n webhook
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('Error from n8n:', errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI service" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await n8nResponse.json();
    const assistantMessage = responseData.message || responseData.response || responseData.answer || "I'm not sure how to respond to that.";
    
    // Save user message to database
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        message: userMessage,
        role: 'user'
      });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
    }

    // Save assistant message to database
    const { error: assistantMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        message: assistantMessage,
        role: 'assistant'
      });

    if (assistantMsgError) {
      console.error('Error saving assistant message:', assistantMsgError);
    }

    return new Response(
      JSON.stringify({ message: assistantMessage }),
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
