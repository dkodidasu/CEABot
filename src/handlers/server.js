// server.js
const {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  createBotFrameworkAuthenticationFromConfiguration,
} = require("botbuilder");
const { Application } = require("@microsoft/teams-ai");
const config = require("../config");

// --- Adapter (Bot Framework) with Teams/Copilot channel support
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppType: "MultiTenant",
  MicrosoftAppId: config.MicrosoftAppId,
  MicrosoftAppPassword: config.MicrosoftAppPassword,
});
const botFrameworkAuth = createBotFrameworkAuthenticationFromConfiguration(
  null,
  credentialsFactory
);
const adapter = new CloudAdapter(botFrameworkAuth);

// --- Teams AI application (works for CEAs)
const agent = new Application({
  adapter,
  // minimal config; you can attach planner/prompts later
});

// Helper: get user-delegated Graph token from ABS OAuth Connection (SSO/Token Exchange first, falls back to OAuth card)
async function getGraphToken(turnContext) {
  const tokenClient = turnContext.turnState.get(
    turnContext.adapter.UserTokenClientKey
  );
  const connectionName = "oauth-connection-1";
  // magicCode is only used for OAuthCard flows; SSO token exchange path won't need it
  const tokenResponse = await tokenClient.getUserToken(
    turnContext.activity.from.id,
    connectionName,
    turnContext.activity.channelId
  );
  return tokenResponse?.token;
}

// Message handler: tries Teams/Copilot SSO (silent). If not available, it will fall back to OAuthCard automatically.
agent.message(async (context, state) => {
  try {
    const token = await getGraphToken(context);
    if (!token) {
      // This triggers OAuth card where required; in Copilot/Teams SSO, users often won't see a prompt.
      await context.adapter.signIn(context, config.OAuthConnectionName);
      await context.sendActivity("Please sign in to continue…");
      return;
    }

    // Choose which demo to run based on text
    const text = (context.activity.text || "").trim().toLowerCase();
    if (text.startsWith("site ")) {
      // e.g., "site contoso.sharepoint.com hr"
      const [, host, sitePath] = text.split(/\s+/);
      const items = await listSharePointSiteRoot(token, host, sitePath);
      await context.sendActivity(`Site items: ${items.value?.length ?? 0}`);
    } else {
      const items = await listOneDriveRoot(token);
      await context.sendActivity(
        `Your OneDrive root has ${items.value?.length ?? 0} item(s).`
      );
    }
  } catch (err) {
    await context.sendActivity(`SSO/Graph error: ${err.message}`);
  }
});

module.exports = { getGraphToken };
