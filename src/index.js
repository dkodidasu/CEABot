// Import required packages
const express = require("express");

// This bot's adapter
const adapter = require("./adapter");

// This bot's main dialog.
const app = require("./app/app");

const path = require("path");
const handleInvokes = require("./handlers/invokeHandler");
const handleMessages = require("./handlers/messageHandler");
const handleConversationUpdates = require("./handlers/conversationUpdateHandler");
const handleInstallationUpdates = require("./handlers/installationUpdateHandler");

const { MemoryStorage, ConversationState, UserState } = require("botbuilder");

const { OAuthDialog } = require("./authDialogs/oAuthDialog");
const { SSOAuthDialog } = require("./authDialogs/ssoAuthDialog");

// Create express application.
const expressApp = express();
expressApp.use(express.json());

const storage = new MemoryStorage();
const conversationState = new ConversationState(storage);
const userState = new UserState(storage);
const oauthDialog = new OAuthDialog(conversationState, userState);
const ssoDialog = new SSOAuthDialog(conversationState, userState);

const server = expressApp.listen(
  process.env.port || process.env.PORT || 3978,
  () => {
    console.log(
      `\nBot Started, ${expressApp.name} listening to`,
      server.address()
    );
  }
);

// Listen for incoming requests.
expressApp.post("/api/messages", async (req, res) => {
  // Route received a request to adapter for processing
  await adapter.process(req, res, async (context) => {
    // Dispatch to Teams AI application - this handles auth automatically
    // await app.run(context);

    const activity = req.body;
    console.log("Req type: ", activity.type);
    console.log("Req text: ", activity.text);
    console.log("Req name: ", activity.name);

    // Handle invoke activities separately if needed (for task modules, etc.)
    if (activity.type == "message") {
      await handleMessages(activity, context, oauthDialog, ssoDialog);
    } else if (activity.type === "invoke") {
      await handleInvokes(activity, context, oauthDialog, ssoDialog);
    } else if (activity.type === "conversationUpdate") {
      await handleConversationUpdates(activity, context);
    } else if (activity.type === "installationUpdate") {
      await handleInstallationUpdates(activity, context);
    }
  });
});

expressApp.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// expressApp.get(
//   "/assets/*",
//   restify.plugins.serveStaticFiles(path.join(__dirname, "..", "assets"))
// );
