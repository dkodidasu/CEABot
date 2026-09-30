// dialogs/authDialog.js
const {
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
  OAuthPrompt,
} = require("botbuilder-dialogs");

const CONNECTION_NAME = process.env.OAUTH_CONNECTION_NAME; // e.g., "oauth-connection-1"
const OAUTH_PROMPT = "OAUTH_PROMPT";
const MAIN_DIALOG = "MAIN_DIALOG";

function createDialogs() {
  const dialogs = new DialogSet(undefined);

  const settings = {
    connectionName: CONNECTION_NAME,
    text: "Please sign in to continue.",
    title: "Sign in",
    timeout: 300000, // 5 minutes
  };

  dialogs.add(new OAuthPrompt(OAUTH_PROMPT, settings));

  dialogs.add(
    new WaterfallDialog(MAIN_DIALOG, [
      // Step 1: ask for token
      async (step) => step.beginDialog(OAUTH_PROMPT),

      // Step 2: token is returned here (or undefined if cancelled)
      async (step) => {
        const tokenResponse = step.result;
        if (!tokenResponse?.token) {
          await step.context.sendActivity(
            "No token—sign-in was cancelled or failed."
          );
          return await step.endDialog();
        }

        // Use token (Graph call, SharePoint via Graph, etc.)
        // example:
        // const resp = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
        //   headers: { Authorization: `Bearer ${tokenResponse.token}` }
        // });
        // const data = await resp.json();
        await step.context.sendActivity("✅ Signed in. I can call Graph now.");
        return await step.endDialog();
      },
    ])
  );

  return dialogs;
}

module.exports = {
  createDialogs,
};
