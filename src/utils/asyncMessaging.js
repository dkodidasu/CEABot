/**
 * Sends a proactive message to a specific Teams thread
 * @param {string} message - The message text to send
 * @param {string} threadId - The thread ID to send the message to
 * @param {string} accessToken - The access token for authentication
 * @returns {Promise<Object>} - The response data from the API call
 */
async function sendAsyncMessage(
  message,
  threadId,
  accessToken,
  serviceUrl,
  entities,
) {
  const body = {
    text: message,
    type: "message",
    ...(entities ? { entities } : {}),  
  };

  const response = await fetch(
    `${serviceUrl}/v3/conversations/${threadId}/activities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  return data;
}

module.exports = {
  sendAsyncMessage,
};
