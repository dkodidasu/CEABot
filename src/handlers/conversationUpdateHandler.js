const { ActivityTypes } = require("botbuilder");

async function handleConversationUpdates(activity, context) {
  if (
    activity.membersAdded &&
    Array.isArray(activity.membersAdded) &&
    activity.membersAdded.length > 0
  ) {
    // const member = activity.membersAdded[0];
    // let memberName = member.id;
    // // If activity.recipient matches the member id, use recipient.name
    // if (
    //   activity.recipient &&
    //   activity.recipient.id === member.id &&
    //   activity.recipient.name
    // ) {
    //   memberName = activity.recipient.name;
    // }
    // if (member && member.id) {
    //   await context.sendActivity({
    //     type: ActivityTypes.Message,
    //     text: `This member got added to the conversation: ${memberName}.`,
    //     channelData: {
    //       feedbackLoop: {
    //         // Enable feedback buttons
    //         type: "default",
    //       },
    //     },
    //   });
    // }
  } else {
    await context.sendActivity({
      type: ActivityTypes.Message,
      text: "conversationUpdate event received.",
    });
  }
}

module.exports = handleConversationUpdates;
