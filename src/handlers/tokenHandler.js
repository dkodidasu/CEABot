const config = require("../config");

async function getBFToken() {
  const url =
    "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", config.MicrosoftAppId);
  params.append("client_secret", config.MicrosoftAppPassword);
  params.append("scope", "https://api.botframework.com/.default");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function getGraphToken() {
  // Use your Azure AD tenant ID for Graph token requests
  const tenantId = config.TenantId || "common";
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", config.MicrosoftAppId);
  params.append("client_secret", config.MicrosoftAppPassword);
  params.append("scope", "https://graph.microsoft.com/.default");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

module.exports = { getBFToken, getGraphToken };
