const {
  ActivityTypes,
  CardFactory,
  MemoryStorage,
  ConversationState,
  TurnContext,
} = require("botbuilder");
const {
  DialogSet,
  DialogTurnStatus,
  OAuthPrompt,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const { type } = require("express/lib/response");
const asyncStream = require("./streamingSupport");
const { sendAsyncMessage } = require("../utils/asyncMessaging");
const {
  collapsibleCard,
  collapsibleCard1,
  genericAdaptiveCard,
  imageWithUrl,
  imageWithBase64,
  messageBackCard,
  actionsAdaptiveCard,
  createTaskAdaptiveCard,
  inlineTaskModuleCard,
  inlineStageViewCard,
  imageWithBase64Big,
  videoAdaptiveCard,
  basicTaskModule,
} = require("./cards");
const { getGraphToken } = require("./server");
const { citations, powerBICitations } = require("./citations");
const { downloadAndExtractText } = require("./fileHandler");
const { createDialogs } = require("./dialog");
const { SSOAuthDialog } = require("../authDialogs/ssoAuthDialog");
const { getBFToken } = require("./tokenHandler");
const config = require("../config");

async function handleMessages(activity, context, oauthDialog, ssoDialog) {
  // Initialize dialog context at the beginning of message handling
  const memoryStorage = new MemoryStorage();
  const conversationState = new ConversationState(memoryStorage);
  const dialogState = conversationState.createProperty("DialogState");

  // Create DialogSet with the state property and add dialogs
  const dialogs = new DialogSet(dialogState);

  // Add OAuth prompt and main dialog directly
  const CONNECTION_NAME =
    process.env.OAUTH_CONNECTION_NAME || "oauth-connection";
  const OAUTH_PROMPT = "OAUTH_PROMPT";
  const MAIN_DIALOG = "MAIN_DIALOG";

  // Check if connection name is available
  if (!CONNECTION_NAME) {
    console.error("OAUTH_CONNECTION_NAME environment variable is not set");
    await context.sendActivity(
      "OAuth connection is not configured. Please contact administrator.",
    );
    return;
  }

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
      // Step 2: token is returned here
      async (step) => {
        const tokenResponse = step.result;
        if (!tokenResponse?.token) {
          await step.context.sendActivity(
            "No token—sign-in was cancelled or failed.",
          );
          return await step.endDialog();
        }
        await step.context.sendActivity("✅ Signed in. I can call Graph now.");
        return await step.endDialog();
      },
    ]),
  );

  const dialogContext = await dialogs.createContext(context);

  // Continue any existing dialog
  const dialogResult = await dialogContext.continueDialog();

  // If dialog completed or no active dialog, process the message
  if (
    dialogResult.status === DialogTurnStatus.empty ||
    dialogResult.status === DialogTurnStatus.complete
  ) {
    if (
      activity.text?.includes("file") ||
      activity.text?.includes("summarize")
    ) {
      // Extract file attachment from activity.attachments
      if (Array.isArray(activity.attachments)) {
        const fileAttachment = activity.attachments.find(
          (att) =>
            att.contentType ===
            "application/vnd.microsoft.teams.file.download.info",
        );
        if (fileAttachment && fileAttachment?.content?.downloadUrl) {
          await context.sendActivity({
            type: ActivityTypes.Message,
            text: await downloadAndExtractText(
              fileAttachment.content.downloadUrl,
            ),
          });
          return;
        }
      }
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: "No file attachment found in the message.",
      });
      return;
    } else if (activity.text?.includes("17")) {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `${activity.text};${Date.now()}`,
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
      });
    } else if (activity.text === "feedback") {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Hey! I'm a friendly AI bot and this message should have feedback buttons!`,
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
      });
    } else if (activity.text === "feedbackCustom") {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Hey! I'm a friendly AI bot and this message should have feedback buttons!`,
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "custom",
          },
        },
      });
    } else if (activity.text === "feedbackInvalid") {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Hey! I'm a friendly AI bot and this message should have feedback buttons!`,
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "invalidtype",
          },
        },
      });
    } else if (activity.text == "citation") {
      const threadId = context.activity.conversation.id;
      const serviceUrl = context.activity.serviceUrl;
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Hey I'm a friendly AI bot. This message is generated through AI [1][2][3][4][5][6][7][8][9][10][11][12][13][14][15][16][17][18][19][20]`, // cite with [1],
        channelData: {
          dummy: "dummyvalue",
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
        entities: [
          {
            type: "https://schema.org/Message",
            "@type": "Message",
            "@context": "https://schema.org",
            additionalType: ["AIGeneratedContent"], // Enables AI label
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Contoso FTE", // Sensitivity title
              description: "Only accessible to Contoso FTE", // Sensitivity description
            },
            citation: citations,
          },
        ],
        suggestedActions: {
          actions: [
            {
              type: "imBack",
              title: "title",
              value: "value",
            },
            {
              type: "imBack",
              title: "createTask",
              value: "createTask",
            },
            {
              type: "imBack",
              title: "feedback",
              value: "feedback",
            },
            {
              type: "imBack",
              title: "abort",
              value: "abort",
            },
          ],
        },
      });

      // Send async follow-up with citations
      const accessToken = (await getBFToken()).access_token;
      await sendAsyncMessage(
        `Here's an async follow-up with the same references [1][2][3][4][5][6][7][8][9][10][11][12][13][14][15][16][17][18][19][20]`,
        threadId,
        accessToken,
        serviceUrl,
        [
          {
            type: "https://schema.org/Message",
            "@type": "Message",
            "@context": "https://schema.org",
            additionalType: ["AIGeneratedContent"],
            citation: citations,
          },
        ],
      );
    } else if (activity.text == "citation1") {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Hey I'm a friendly AI bot. This message is generated through AI [1]`, // cite with [1],
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
        entities: [
          {
            type: "https://schema.org/Message",
            "@type": "Message",
            "@context": "https://schema.org",
            additionalType: ["AIGeneratedContent"], // Enables AI label
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Contoso FTE", // Sensitivity title
              description: "Only accessible to Contoso FTE", // Sensitivity description
            },
            citation: [
              {
                "@type": "Claim",
                position: 1, // Required. Must match the [1] in the text above
                appearance: {
                  "@type": "DigitalDocument",
                  name: "AI bot", // Title
                  url: "https://example.com/claim-1", // Hyperlink on the title
                  abstract:
                    "Excerpt description Open as native app (this is basically Chat app is tightly integrated into the actual app)", // Appears in the citation pop-up window
                  text: '{"type":"AdaptiveCard","$schema":"http://adaptivecards.io/schemas/adaptive-card.json","version":"1.6","body":[{"type":"TextBlock","text":"Adaptive Card text"}]}', // Appears as a stringified Adaptive Card
                  keywords: [
                    "keyword 1 Open as native app (this is basically Chat app is tightly integrated)",
                    "keyword 2 Open as native app (this is basically Chat app is tightly integrated)",
                    "keyword 3 Open as native app (this is basically Chat app is tightly integrated)",
                  ], // Appears in the citation pop-up window
                  encodingFormat: "application/vnd.microsoft.card.adaptive",
                  // image: {
                  //   "@type": "ImageObject",
                  //   name: "Microsoft Word",
                  // },
                  // usageInfo: {
                  //   "@type": "CreativeWork",
                  //   "@id": "sensitivity1",
                  //   name: "Confidential // Contoso FTE",
                  //   description: "Only accessible to Contoso FTE",
                  // },
                },
              },
            ],
          },
        ],
        suggestedActions: {
          actions: [
            {
              type: "imBack",
              title: "streamAsync",
              value: "streamAsync",
            },
            {
              type: "imBack",
              title: "async60",
              value: "async60",
            },
            {
              type: "imBack",
              title: "imageUrl",
              value: "imageUrl",
            },
          ],
        },
      });
    } else if (activity.text == "worldCup") {
      const buildWorldCupCard = (title, subtitle, excerpt, facts) => ({
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.6",
        body: [
          {
            type: "TextBlock",
            text: title,
            weight: "Bolder",
            size: "Medium",
            wrap: true,
          },
          {
            type: "TextBlock",
            text: subtitle,
            isSubtle: true,
            size: "Small",
            wrap: true,
          },
          {
            type: "TextBlock",
            text: excerpt,
            wrap: true,
            spacing: "Medium",
          },
          {
            type: "FactSet",
            facts,
          },
        ],
      });

      const worldCupCitations = [
        {
          "@type": "Claim",
          position: 1,
          appearance: {
            "@type": "DigitalDocument",
            name: "FIFA World Cup 2022 Final — Match Report",
            url: "https://www.fifa.com/en/tournaments/mens/worldcup/qatar2022",
            abstract:
              "Argentina defeated France in the 2022 FIFA World Cup final held at Lusail Stadium in Qatar.",
            text: JSON.stringify(
              buildWorldCupCard(
                "2022 FIFA World Cup Final",
                "FIFA · Lusail Stadium, Qatar · 18 December 2022",
                "Argentina and France finished 3-3 after extra time before Argentina won 4-2 on penalties to claim their third world title.",
                [
                  { title: "Winner", value: "Argentina" },
                  { title: "Runner-up", value: "France" },
                  { title: "Final Score", value: "3-3 (4-2 pens)" },
                  { title: "Venue", value: "Lusail Stadium" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["World Cup 2022", "Final", "Argentina"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
          },
        },
        {
          "@type": "Claim",
          position: 2,
          appearance: {
            "@type": "DigitalDocument",
            name: "Lionel Messi — Golden Ball Winner",
            url: "https://www.fifa.com/en/tournaments/mens/worldcup/qatar2022/awards",
            abstract:
              "Lionel Messi was named the best player of the tournament and lifted his first World Cup trophy.",
            text: JSON.stringify(
              buildWorldCupCard(
                "Golden Ball: Lionel Messi",
                "FIFA Awards · Qatar 2022",
                "Messi scored 7 goals and provided 3 assists across the tournament, earning the Golden Ball as the World Cup's best player.",
                [
                  { title: "Player", value: "Lionel Messi" },
                  { title: "Country", value: "Argentina" },
                  { title: "Goals", value: "7" },
                  { title: "Assists", value: "3" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Golden Ball", "Messi", "Argentina"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
          },
        },
        {
          "@type": "Claim",
          position: 3,
          appearance: {
            "@type": "DigitalDocument",
            name: "Kylian Mbappé — Golden Boot Winner",
            url: "https://www.fifa.com/en/tournaments/mens/worldcup/qatar2022/awards",
            abstract:
              "Kylian Mbappé won the Golden Boot as the top scorer, including a hat-trick in the final.",
            text: JSON.stringify(
              buildWorldCupCard(
                "Golden Boot: Kylian Mbappé",
                "FIFA Awards · Qatar 2022",
                "Mbappé finished as the tournament's top scorer with 8 goals and became the first player since 1966 to score a hat-trick in a World Cup final.",
                [
                  { title: "Player", value: "Kylian Mbappé" },
                  { title: "Country", value: "France" },
                  { title: "Goals", value: "8" },
                  { title: "Final Hat-trick", value: "Yes" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Golden Boot", "Mbappé", "France"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
          },
        },
        {
          "@type": "Claim",
          position: 4,
          appearance: {
            "@type": "DigitalDocument",
            name: "Qatar 2022 — Tournament Overview",
            url: "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup",
            abstract:
              "The 2022 FIFA World Cup was the first to be held in the Arab world and in a Muslim-majority country.",
            text: JSON.stringify(
              buildWorldCupCard(
                "Qatar 2022 Overview",
                "Reference · 20 November – 18 December 2022",
                "The tournament featured 32 teams across 8 stadiums in Qatar and was the last edition with 32 participating nations before expanding to 48.",
                [
                  { title: "Host", value: "Qatar" },
                  { title: "Teams", value: "32" },
                  { title: "Matches", value: "64" },
                  { title: "Dates", value: "20 Nov – 18 Dec 2022" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Qatar 2022", "Host", "32 teams"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
          },
        },
      ];

      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `The last FIFA World Cup was **Qatar 2022**. Argentina won it, beating France 3-3 (4-2 on penalties) in the final [1]. Lionel Messi won the Golden Ball as best player [2], while Kylian Mbappé took the Golden Boot as top scorer with a hat-trick in the final [3]. It was the first World Cup hosted in the Arab world, featuring 32 teams across 8 stadiums [4].`,
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
        entities: [
          {
            type: "https://schema.org/Message",
            "@type": "Message",
            "@context": "https://schema.org",
            additionalType: ["AIGeneratedContent"], // Enables AI label
            usageInfo: {
              "@type": "CreativeWork",
              name: "Public // Sports Reference",
              description: "Publicly available sports information",
            },
            citation: worldCupCitations,
          },
        ],
      });
    } else if (
      (() => {
        const q = activity.text?.toLowerCase() ?? "";
        return (
          q.includes("copilot") &&
          (q.includes("plan") || q.includes("roadmap")) &&
          q.includes("2026")
        );
      })()
    ) {
      const buildDocCard = (title, subtitle, excerpt, facts) => ({
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.6",
        body: [
          {
            type: "ColumnSet",
            columns: [
              {
                type: "Column",
                width: "auto",
                items: [
                  {
                    type: "Image",
                    url: "https://adaptivecards.io/content/cats/1.png",
                    size: "Medium",
                    style: "Person",
                  },
                ],
              },
              {
                type: "Column",
                width: "stretch",
                items: [
                  {
                    type: "TextBlock",
                    text: title,
                    weight: "Bolder",
                    size: "Medium",
                    wrap: true,
                  },
                  {
                    type: "TextBlock",
                    text: subtitle,
                    isSubtle: true,
                    size: "Small",
                    wrap: true,
                  },
                ],
              },
            ],
          },
          {
            type: "TextBlock",
            text: excerpt,
            wrap: true,
            spacing: "Medium",
          },
          {
            type: "FactSet",
            facts,
          },
          {
            type: "Image",
            url: "https://adaptivecards.io/content/AlkiBeach.jpg",
            size: "Stretch",
            altText: "Document preview image",
          },
        ],
      });

      const msInternalCitations = [
        {
          "@type": "Claim",
          position: 1,
          appearance: {
            "@type": "DigitalDocument",
            name: "FY26 Copilot Roadmap.docx",
            url: "https://example.com/claim-1",
            abstract:
              "Internal Word document outlining the Microsoft 365 Copilot feature roadmap for fiscal year 2026.",
            text: JSON.stringify(
              buildDocCard(
                "FY26 Copilot Roadmap",
                "Microsoft Word · Last modified June 2026",
                "Details the planned rollout of agent extensibility, Copilot Studio integrations, and reasoning model upgrades across Microsoft 365.",
                [
                  { title: "Owner", value: "Copilot PM Team" },
                  { title: "Status", value: "Draft" },
                  { title: "Classification", value: "Confidential" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Copilot", "Roadmap", "FY26"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
            image: {
              "@type": "ImageObject",
              name: "Microsoft Word",
            },
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Microsoft FTE",
              description: "Only accessible to Microsoft full-time employees",
            },
          },
        },
        {
          "@type": "Claim",
          position: 2,
          appearance: {
            "@type": "DigitalDocument",
            name: "Copilot Adoption Metrics.xlsx",
            url: "https://example.com/claim-2",
            abstract:
              "Internal Excel workbook tracking monthly active users and seat adoption for Microsoft 365 Copilot.",
            text: JSON.stringify(
              buildDocCard(
                "Copilot Adoption Metrics",
                "Microsoft Excel · Last modified June 2026",
                "Contains MAU trends, enterprise seat growth, and per-workload usage breakdowns for the last four quarters.",
                [
                  { title: "Owner", value: "Business Analytics" },
                  { title: "Refresh", value: "Weekly" },
                  { title: "Classification", value: "Confidential" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Adoption", "Metrics", "Analytics"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
            image: {
              "@type": "ImageObject",
              name: "Microsoft Excel",
            },
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Microsoft FTE",
              description: "Only accessible to Microsoft full-time employees",
            },
          },
        },
        {
          "@type": "Claim",
          position: 3,
          appearance: {
            "@type": "DigitalDocument",
            name: "Ignite 2026 Keynote.pptx",
            url: "https://example.com/claim-3",
            abstract:
              "Internal PowerPoint deck for the Microsoft Ignite 2026 opening keynote.",
            text: JSON.stringify(
              buildDocCard(
                "Ignite 2026 Keynote",
                "Microsoft PowerPoint · Last modified June 2026",
                "Draft narrative and demo flow covering Copilot agents, security, and cloud infrastructure announcements.",
                [
                  { title: "Owner", value: "Events Marketing" },
                  { title: "Status", value: "In Review" },
                  { title: "Classification", value: "Highly Confidential" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Ignite", "Keynote", "Announcements"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
            image: {
              "@type": "ImageObject",
              name: "Microsoft PowerPoint",
            },
            usageInfo: {
              "@type": "CreativeWork",
              name: "Highly Confidential // Microsoft FTE",
              description: "Restricted to the Ignite planning team",
            },
          },
        },
        {
          "@type": "Claim",
          position: 4,
          appearance: {
            "@type": "DigitalDocument",
            name: "Engineering Design Notes",
            url: "https://example.com/claim-4",
            abstract:
              "Internal OneNote notebook capturing architecture decisions for the Copilot orchestration layer.",
            text: JSON.stringify(
              buildDocCard(
                "Engineering Design Notes",
                "Microsoft OneNote · Last modified June 2026",
                "Running log of design reviews, ADRs, and open questions for the agent orchestration and grounding pipeline.",
                [
                  { title: "Owner", value: "Copilot Eng" },
                  { title: "Section", value: "Architecture" },
                  { title: "Classification", value: "Confidential" },
                ],
              ),
              null,
              0,
            ),
            keywords: ["Design", "Architecture", "Engineering"],
            encodingFormat: "application/vnd.microsoft.card.adaptive",
            image: {
              "@type": "ImageObject",
              name: "Microsoft OneNote",
            },
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Microsoft FTE",
              description: "Only accessible to Microsoft full-time employees",
            },
          },
        },
      ];

      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Here's where **Microsoft 365 Copilot** is headed in 2026. The FY26 roadmap centers on **agent extensibility**, deeper **Copilot Studio** integration, and next-generation **reasoning models** that ground answers across your Microsoft Graph data [1]. That investment is paying off — enterprise **seat adoption** and monthly active usage have grown steadily across every workload over the last four quarters [2]. These bets will take center stage at the **Ignite 2026 keynote**, spanning Copilot agents, security, and cloud infrastructure [3]. Under the hood, the supporting **orchestration and grounding architecture** — including agent routing and retrieval decisions — is documented in the engineering design notes [4].`,
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
        entities: [
          {
            type: "https://schema.org/Message",
            "@type": "Message",
            "@context": "https://schema.org",
            additionalType: ["AIGeneratedContent"], // Enables AI label
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Microsoft FTE", // Sensitivity title
              description: "Only accessible to Microsoft full-time employees", // Sensitivity description
            },
            citation: msInternalCitations,
          },
        ],
      });
    } else if (activity.text == "powerBICitation") {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Hey I'm a friendly AI bot. This message is generated through AI [1][2][3][4][5]`, // cite with [1],
        channelData: {
          feedbackLoop: {
            // Enable feedback buttons
            type: "default",
          },
        },
        entities: [
          {
            type: "https://schema.org/Message",
            "@type": "Message",
            "@context": "https://schema.org",
            additionalType: ["AIGeneratedContent"], // Enables AI label
            usageInfo: {
              "@type": "CreativeWork",
              name: "Confidential // Contoso FTE", // Sensitivity title
              description: "Only accessible to Contoso FTE", // Sensitivity description
            },
            citation: powerBICitations,
          },
        ],
      });
    } else if (activity.text == "messageBack") {
      await context.sendActivity({
        attachments: [
          {
            content: messageBackCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "adaptiveCard") {
      // await new Promise((resolve) => {
      //   setTimeout(async () => {
      //     resolve();
      //   }, 10 * 1000);
      // });

      // await asyncStream(context);

      await context.sendActivity({
        attachments: [
          {
            content: genericAdaptiveCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });

      console.log("Sent genericAdaptiveCard");
    } else if (activity.text == "actionsAdaptiveCard") {
      await context.sendActivity({
        attachments: [
          {
            content: actionsAdaptiveCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "basicTaskModule") {
      await context.sendActivity({
        attachments: [
          {
            content: basicTaskModule,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "createTask") {
      await context.sendActivity({
        attachments: [
          {
            content: createTaskAdaptiveCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "streamAsync") {
      await asyncStream(context);
    } else if (activity.text == "streamLong") {
      const { StreamingResponse } = require("@microsoft/teams-ai");

      const longText = `Microsoft 365 Copilot is designed to weave generative AI directly into the apps people already use every day — Word, Excel, PowerPoint, Outlook, and Teams. Instead of switching to a separate tool, you can ask Copilot to draft a document, summarize a long email thread, build a slide deck from a set of notes, or surface trends hidden inside a spreadsheet, all without leaving your current workflow.

What makes this more than a novelty is the grounding layer. Copilot combines the reasoning power of large language models with your organization's own data through the Microsoft Graph — your emails, meetings, chats, and documents. That grounding is what turns a generic answer into one that is specific to your projects, your customers, and your team, while still respecting the permissions you already have.

Trust is central to the design. Every capability is built on top of the Responsible AI Standard, which sets expectations around fairness, reliability, safety, and transparency. Outputs are labeled as AI-generated, and the system is engineered so that people stay in control of the final decision rather than deferring blindly to the model.

Security and compliance are treated as first-class requirements, not afterthoughts. Enterprise data stays within your tenant's compliance boundary, is encrypted in transit and at rest, and is never used to train the foundation models. Existing governance controls — sensitivity labels, retention policies, and access permissions — continue to apply to everything Copilot touches.

Taken together, these pieces explain why adoption has accelerated: the value is immediate and contextual, while the guardrails around responsibility and data protection give organizations the confidence to roll it out broadly.`;

      // Split into sentence-sized chunks so the client renders progressive text.
      const chunks = longText.match(/[^.]+\.?|\n+/g) || [longText];

      await new Promise((resolve) => {
        const stream = new StreamingResponse(context);

        stream.queueInformativeUpdate("Looking for responses");

        const sendChunk = (index) => {
          if (index >= chunks.length) {
            stream.setGeneratedByAILabel(true);
            stream.endStream().then(() => resolve());
            return;
          }
          stream.queueTextChunk(chunks[index]);
          stream.waitForQueue().then(() => {
            setTimeout(() => sendChunk(index + 1), 500);
          });
        };

        setTimeout(() => sendChunk(0), 1500);
      });
    } else if (activity.text == "collapsibleCard") {
      await context.sendActivity({
        attachments: [
          {
            content: collapsibleCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "collapsibleCard1") {
      await context.sendActivity({
        attachments: [
          {
            content: collapsibleCard1,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "loginOAuth") {
      await oauthDialog.run(context, true);
    } else if (activity.text == "loginSSO") {
      await ssoDialog.run(context, true);
    } else if (activity.text == "imageUrl") {
      await context.sendActivity({
        attachments: [
          {
            content: imageWithUrl,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "imageWithBase64") {
      await context.sendActivity({
        attachments: [
          {
            content: imageWithBase64,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "imageWithBase64Big") {
      await context.sendActivity({
        attachments: [
          {
            content: imageWithBase64Big,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "inlineTaskModule") {
      await context.sendActivity({
        attachments: [
          {
            content: inlineTaskModuleCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "inlineStageView") {
      await context.sendActivity({
        attachments: [
          {
            content: inlineStageViewCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "multiMessage") {
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `This is the first message`,
      });
      await context.sendActivity({
        attachments: [
          {
            content: genericAdaptiveCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `This is the last message`,
      });
    } else if (activity.text == "async60") {
      return new Promise(async (resolve) => {
        const serviceUrl = context.activity.serviceUrl;
        const threadId = context.activity.conversation.id;
        await context.sendActivity({
          text: "Thank you for order laptop. I will keep you posted with updates.",
        });

        setTimeout(async () => {
          await context.sendActivity({
            attachments: [
              {
                content: genericAdaptiveCard,
                contentType: "application/vnd.microsoft.card.adaptive",
              },
            ],
          });
          resolve();
        }, 5 * 1000);

        let accessToken = (await getBFToken()).access_token;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await sendAsyncMessage(
          "Your laptop order #1234 has been processed.",
          threadId,
          accessToken,
          serviceUrl,
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));
        await sendAsyncMessage(
          "Your laptop order #1234 has been shipped.",
          threadId,
          accessToken,
          serviceUrl,
        );

        // await new Promise((resolve) => setTimeout(resolve, 1000));
        // await sendAsyncMessage(
        //   "Your laptop order #1234 has been delivered.",
        //   threadId,
        //   accessToken,
        //   serviceUrl,
        // );
      });
    } else if (activity.text == "asyncTimeOut") {
      return new Promise(async (resolve) => {
        setTimeout(async () => {
          await context.sendActivity({
            attachments: [
              {
                content: genericAdaptiveCard,
                contentType: "application/vnd.microsoft.card.adaptive",
              },
            ],
          });
          resolve();
        }, 60 * 1000);
      });
    } else if (activity.text == "asyncTimeOutText") {
      return new Promise(async (resolve) => {
        setTimeout(async () => {
          await context.sendActivity({
            text: `Thank you for ordering your laptop! 🎉

We truly appreciate your business and want to keep you fully informed throughout the entire process. Your order is now being carefully reviewed by our fulfillment team, and we are working diligently to ensure that everything is processed accurately and efficiently.

Here's what you can expect next:
1. **Order Confirmation** - You'll receive a detailed confirmation with your order number, item specifications, and estimated delivery timeline.
2. **Processing & Quality Check** - Our team will verify the laptop configuration, perform initial quality checks, and prepare it for shipment.
3. **Shipping Updates** - Once your laptop is dispatched, you'll receive tracking information so you can follow its journey in real-time.
4. **Delivery Notification** - We'll notify you when your laptop is out for delivery and again once it has been successfully delivered.

In the meantime, if you have any questions about your order, need to update your shipping address, or want to add accessories, please don't hesitate to reach out. Our support team is available 24/7 to assist you.

Thank you once again for choosing us. We're excited to get your new laptop into your hands and can't wait for you to experience it!

Best regards,
The Order Management Team`,
          });
          resolve();
        }, 60 * 1000);
      });
    } else if (activity.text == "delayedResponse30") {
      const conversationReference = TurnContext.getConversationReference(
        context.activity,
      );

      setTimeout(async () => {
        try {
          await context.adapter.continueConversationAsync(
            config.MicrosoftAppId,
            conversationReference,
            async (proactiveContext) => {
              await proactiveContext.sendActivity({
                type: ActivityTypes.Message,
                text: `Thanks for waiting — the requested analysis is ready.

We reviewed the available information and organized the key findings into a concise summary. The current plan is progressing as expected, with the main work items moving through validation, implementation, and review. The highest-priority follow-up is to confirm the remaining dependencies, assign clear owners, and capture any decisions that affect timing or scope.

## Recommended next steps

1. **Validate the remaining requirements** — confirm that the intended outcomes, acceptance criteria, and constraints are still current.
2. **Review dependencies and risks** — identify any external services, approvals, or data sources that could affect delivery.
3. **Assign owners and dates** — make each action measurable with a responsible person and a target completion date.
4. **Share a progress update** — communicate the current status, open questions, and next checkpoint with stakeholders.

No critical blockers were identified in this response. Continuing with these steps should keep the work coordinated and make any changes visible early.`,
                textFormat: "markdown",
              });
            },
          );
        } catch (error) {
          console.error("Unable to send delayed response:", error);
        }
      }, 30 * 1000);
    } else if (activity.text == "proactive") {
      let accessToken = (await getBFToken()).access_token;

      //create conversation first
      const createConversationBody = {
        members: [{ id: context.activity.from.aadObjectId }],
        tenantId: context.activity.conversation.tenantId,
        channelData: {
          productContext: "Copilot",
          conversation: {
            conversationSubType: "AgentProactive",
          },
        },
      };

      const createConversationResponse = await fetch(
        "https://canary.botapi.skype.com/teams/v3/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(createConversationBody),
        },
      );

      const createConversationResponseData =
        await createConversationResponse.json();
      console.log(
        "Create conversation response",
        createConversationResponseData,
      );
      const message = `Hello proactive world - ${new Date().toLocaleString()}`;

      const data = await sendAsyncMessage(
        message,
        createConversationResponseData.id,
        accessToken,
        serviceUrl,
      );
      await context.sendActivity({
        type: ActivityTypes.Message,
        text: `Proactive message sent with id: ${data.id}`,
      });
    } else if (activity.text == "getMessages") {
      // Get list of messages in the conversation
      try {
        const accessToken = (await getBFToken()).access_token;
        const conversationId = activity.conversation.id;

        const response = await fetch(
          `https://canary.botapi.skype.com/v3/conversations/${conversationId}/activities`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();
        const activities = data.activities || data.value || [];

        // Format the response
        let messageList = `## Conversation Messages (${activities.length} total)\n\n`;

        if (activities.length > 0) {
          activities.slice(0, 20).forEach((act, index) => {
            if (act.type === "message" && act.text) {
              const from = act.from?.name || "Unknown";
              const text = act.text || "No text";
              const timestamp = new Date(act.timestamp).toLocaleString();

              messageList += `**${index + 1}. ${from}** (${timestamp})\n`;
              messageList += `${text.substring(0, 100)}${
                text.length > 100 ? "..." : ""
              }\n\n`;
            }
          });
        } else {
          messageList += "No messages found in this conversation.";
        }

        await context.sendActivity({
          type: ActivityTypes.Message,
          text: messageList,
          textFormat: "markdown",
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        await context.sendActivity({
          type: ActivityTypes.Message,
          text: `Error fetching messages: ${error.message}`,
        });
      }
    } else if (activity.text == "richTextAdaptiveCard") {
      await context.sendActivity({
        attachments: [
          {
            content: inlineTaskModuleCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "videoAdaptiveCard") {
      await context.sendActivity({
        attachments: [
          {
            content: videoAdaptiveCard,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "adaptiveCardWithImage") {
      const adaptiveCardWithImage = {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.6",
        body: [
          {
            type: "TextBlock",
            text: "Here is a public image in an Adaptive Card!",
            weight: "Bolder",
            size: "Medium",
          },
          {
            type: "Image",
            url: "https://adaptivecards.io/content/cats/1.png",
            size: "Large",
          },
        ],
      };
      await context.sendActivity({
        attachments: [
          {
            content: adaptiveCardWithImage,
            contentType: "application/vnd.microsoft.card.adaptive",
          },
        ],
      });
    } else if (activity.text == "markdown") {
      await context.sendActivity({
        text: `
# Markdown Examples

![Public Image](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png)

This is **bold**, this is *italic*, and this is a [link](https://example.com).

1. First item  
2. Second item  
   - Subitem A  
   - Subitem B  

> Markdown quote block

\`Inline code\` example and a horizontal rule below.

---

| Name  | Age | City     |
|-------|-----|-----------|
| Alice | 24  | Seattle   |
| Bob   | 30  | New York  |
| Cara  | 28  | London    |
`,
        textFormat: "markdown",
      });
    } else if (activity.text == "html") {
      await context.sendActivity({
        text: `
<h1>HTML Examples</h1>
<p>This section uses <b>HTML tags</b> only. It includes a paragraph with <i>italic</i> and <a href="https://example.com">a link</a>.</p>

<ol>
  <li>HTML Ordered Item 1</li>
  <li>HTML Ordered Item 2</li>
</ol>

<blockquote>HTML quote block</blockquote>

<hr />

<h2>HTML Table</h2>
<table border="1">
  <tr><th>Language</th><th>Type</th></tr>
  <tr><td>Markdown</td><td>Lightweight markup</td></tr>
  <tr><td>HTML</td><td>Structured markup</td></tr>
</table>
`,
        textFormat: "markdown",
      });
    } else if (activity.text == "getConversation") {
      let accessToken;
      try {
        const tokenResponse = await getToken();
        accessToken = tokenResponse.access_token;
        if (!accessToken) {
          throw new Error("Failed to obtain access token");
        }
      } catch (error) {
        console.error("Error retrieving access token:", error);
        await context.sendActivity(
          "Failed to send conversation due to authentication error",
        );
        return;
      }

      const response = await fetch(
        `https://smba.trafficmanager.net/apis/v3/conversations/${activity.conversation.id}/activities`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      try {
        const data = await response.json();

        // The response typically contains an array of activities
        const activities = data.value || data.activities || [];

        // Create a summary of the activities
        let summary = "## Conversation Activities Summary\n\n";
        summary += `Total activities: ${activities.length}\n\n`;

        if (activities.length > 0) {
          summary += "| Type | From | Text Preview | Timestamp |\n";
          summary += "| --- | --- | --- | --- |\n";

          activities.slice(0, 10).forEach((activity) => {
            // Show only first 10 activities
            const type = activity.type || "unknown";
            const from = activity.from?.name || activity.from?.id || "unknown";
            const textPreview = activity.text
              ? activity.text.length > 50
                ? activity.text.substring(0, 50) + "..."
                : activity.text
              : "No text";
            const timestamp = activity.timestamp
              ? new Date(activity.timestamp).toLocaleString()
              : "unknown";

            summary += `| ${type} | ${from} | ${textPreview} | ${timestamp} |\n`;
          });

          if (activities.length > 10) {
            summary += `\n... and ${activities.length - 10} more activities`;
          }
        } else {
          summary += "No activities found in this conversation.";
        }

        await context.sendActivity({
          text: summary,
          textFormat: "markdown",
        });
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        await context.sendActivity({
          text: "Failed to parse conversation activities response.",
        });
      }
    } else if (activity.text === "ssoCard") {
      // Use your actual connection name and tokenExchangeResource id
      const connectionName = "oauth-connection";
      const tokenExchangeResource = {
        id: "fb3e58b8-0fcb-4bc4-bd56-00db3f2d29c2",
      };

      const oauthCard = {
        contentType: "application/vnd.microsoft.card.oauth",
        content: {
          text: "Please Sign In",
          connectionName,
          tokenExchangeResource,
        },
      };

      await context.sendActivity({
        type: "ssoauth",
        attachments: [oauthCard],
      });
    } else if (activity.text === "oauth") {
      await oauthDialog.run(context);
    } else if (activity.text === "logoutOAuth") {
      await oauthDialog.logout(context);
    } else if (activity.text === "sso") {
      await ssoDialog.run(context, true);
    } else if (activity.text === "logoutSSO") {
      await ssoDialog.logout(context);
    } else if (activity.text === "order a laptop") {
      const threadId = context.activity.conversation.id;
      const serviceUrl = context.activity.serviceUrl;
      await context.sendActivity({ type: "typing" });
      // await context.sendActivity({
      //   type: ActivityTypes.Message,
      //   text: "Thanks for ordering a laptop! Your order #1234 is being processed and you will receive updates here.",
      // });

      // Kick off ordering
      let accessToken = (await getBFToken()).access_token;
      await sendAsyncMessage(
        "Thanks for ordering a laptop! Your order #1234 is being processed and you will receive updates here.",
        threadId,
        accessToken,
        serviceUrl,
      );

      await new Promise((resolve) => setTimeout(resolve, 15000));
      await sendAsyncMessage(
        "Your laptop order #1234 has been processed.",
        threadId,
        accessToken,
        serviceUrl,
      );

      await new Promise((resolve) => setTimeout(resolve, 30000));
      await sendAsyncMessage(
        "Your laptop order #1234 has been shipped.",
        threadId,
        accessToken,
        serviceUrl,
      );

      await new Promise((resolve) => setTimeout(resolve, 30000));
      await sendAsyncMessage(
        "Your laptop order #1234 has been delivered.",
        threadId,
        accessToken,
        serviceUrl,
      );
    } else if (activity.text === "updateMessage") {
      const messageResponse = await context.sendActivity({
        type: ActivityTypes.Message,
        text: "Just keep looking at the message, it will update in 10 seconds...",
      });

      // Store the activity ID and conversation reference for later update
      const activityId = messageResponse.id;
      const conversationId = activity.conversation.id;
      const serviceUrl = activity.serviceUrl;

      // Update the message after 10 seconds using Bot Framework API
      setTimeout(async () => {
        try {
          const accessToken = (await getBFToken()).access_token;

          const updateResponse = await fetch(
            `${serviceUrl}v3/conversations/${conversationId}/activities/${activityId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                type: "message",
                text: "✅ Message has been updated! This is the new text.",
              }),
            },
          );

          if (updateResponse.ok) {
            console.log("Message updated successfully");
          } else {
            console.error(
              "Failed to update message:",
              await updateResponse.text(),
            );
          }
        } catch (error) {
          console.error("Error updating message:", error);
        }
      }, 10000);
    } else {
      await context.sendActivity({
        text: activity.text,
      });
    }

    // Save conversation state after processing
    await conversationState.saveChanges(context);
  }
}

module.exports = handleMessages;
