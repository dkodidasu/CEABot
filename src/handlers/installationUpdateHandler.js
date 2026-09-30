const { ActivityTypes } = require("botbuilder");
const { getBFToken } = require("./tokenHandler");
const { sendAsyncMessage } = require("../utils/asyncMessaging");

async function handleInstallationUpdates(activity, context) {
  // Handle bot installation/addition
  try {
    // Get Bot Framework token
    const accessToken = (await getBFToken()).access_token;

    // Create conversation body similar to proactive command
    const createConversationBody = {
      members: [{ id: activity.from.aadObjectId }],
      tenantId: activity.conversation.tenantId,
      channelData: {
        productContext: "Copilot",
        conversation: {
          conversationSubType: "AgentProactive",
        },
      },
    };

    // Create a new conversation
    const createConversationResponse = await fetch(
      "https://canary.botapi.skype.com/teams/v3/conversations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(createConversationBody),
      }
    );

    const createConversationResponseData =
      await createConversationResponse.json();
    console.log(
      "Installation: Create conversation response",
      createConversationResponseData
    );

    // Send welcome message via async messaging
    const welcomeMessage = `👋 Welcome! Thank you for installing ${activity.recipient.name}. I'm here to help you. Type any message to get started!`;

    const data = await sendAsyncMessage(
      welcomeMessage,
      createConversationResponseData.id,
      accessToken
    );

    console.log(`Welcome message sent with id: ${data.id}`);
  } catch (error) {
    console.error("Error sending installation welcome message:", error);
    // Fallback to regular message if proactive fails
    await context.sendActivity({
      type: ActivityTypes.Message,
      text: `👋 Welcome! Thank you for installing the bot. I'm here to help you!`,
    });
  }
}

module.exports = handleInstallationUpdates;

// Sample installationUpdate activity
// {
//     "action": "add",
//     "type": "installationUpdate",
//     "timestamp": "2025-12-16T06:58:14.614Z",
//     "id": "f:2761d82a-b84b-6f1d-8bc5-394cfe58d1e4",
//     "channelId": "msteams",
//     "serviceUrl": "https://smba.trafficmanager.net/amer/72f988bf-86f1-41af-91ab-2d7cd011db47/",
//     "from": {
//         "id": "29:1CgPxLjGGs9iGUHPAPpAcvuMDU-oRPe9ciQejIg6acpbXlYV36QifivYYa6tZKPpu6S_r6Aw1SFrS3ZH4sHg_ow",
//         "aadObjectId": "e5b3345b-60c4-4b79-9eff-e49384d9831b"
//     },
//     "conversation": {
//         "conversationType": "personal",
//         "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
//         "id": "a:15ZNmFyA2ydnsokYS8dvnOZVvtpPEKnwuc4AMRWAE-sBIKahfl9wu_vOZHbF9p_UQUaqdY0IyjwakqueMSzD-yqXVA3TS-MVo8x4p645sZMApN-SuW3C-kcYS4PiEHGxG"
//     },
//     "recipient": {
//         "id": "28:71b071d8-8d5a-4791-82b3-dd88c320fc3f",
//         "name": "kss-app-multi-tenant-local-bot-1"
//     },
//     "entities": [
//         {
//             "locale": "en-GB",
//             "type": "clientInfo"
//         }
//     ],
//     "channelData": {
//         "settings": {
//             "selectedChannel": {
//                 "id": "19:e5b3345b-60c4-4b79-9eff-e49384d9831b_71b071d8-8d5a-4791-82b3-dd88c320fc3f@unq.gbl.spaces"
//             }
//         },
//         "tenant": {
//             "id": "72f988bf-86f1-41af-91ab-2d7cd011db47"
//         },
//         "source": {
//             "name": "message"
//         }
//     },
//     "locale": "en-GB"
// }
