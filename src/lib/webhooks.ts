
/**
 * Utility function to call the n8n webhook with the user ID
 * @param userId The user ID to send to the webhook
 */
export async function sendLoginWebhook(userId: string): Promise<void> {
  try {
    // Construct the URL with the user ID as a query parameter
    const webhookUrl = `https://ckproductspace.app.n8n.cloud/webhook/8fc953a0-0903-4303-854f-158eefeaa634?userId=${encodeURIComponent(userId)}`;
    
    // Send the webhook request
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Empty body as we're sending the data as a query parameter
      body: JSON.stringify({}),
    });
    
    if (!response.ok) {
      console.error('Webhook call failed with status:', response.status);
    } else {
      console.log('Webhook call succeeded for user:', userId);
    }
  } catch (error) {
    // Log the error but don't throw it to avoid disrupting the user experience
    console.error('Error calling login webhook:', error);
  }
}
