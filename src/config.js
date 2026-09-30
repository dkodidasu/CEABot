const config = {
  MicrosoftAppId: process.env.BOT_ID || "",
  MicrosoftAppType: process.env.BOT_TYPE || "MultiTenant",
  MicrosoftAppTenantId: process.env.BOT_TENANT_ID || "",
  MicrosoftAppPassword: process.env.BOT_PASSWORD || "",
  azureOpenAIKey: process.env.AZURE_OPENAI_API_KEY || "",
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
  azureOpenAIDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "",
  OAuthConnectionName: process.env.OAUTH_CONNECTION_NAME || "oauth-connection-1",
};

module.exports = config;
