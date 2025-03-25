// Import required packages
const express = require("express");

// This bot's adapter
const adapter = require("./adapter");

// This bot's main dialog.
const app = require("./app/app");

const { ActivityTypes } = require("botbuilder");

const path = require("path");

// Create express application.
const expressApp = express();
expressApp.use(express.json());

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
    // Dispatch to application for routing
    // await app.run(context);
    // if (req.activity.type == "message") {
    //   console.log("Message received: ", req.activity);
    //   // if (context.activity.value?.commandId)
    // }

    const activity = req.body;
    console.log("Req type: ", activity.type);
    console.log("Req text: ", activity.text);
    console.log("Req body: ", activity);

    if (activity.type === "message") {
      if (activity.text === "feedback") {
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
      }
    } else if (activity.type === "invoke") {
      if (
        activity.name == "message/fetchTask" &&
        activity.value.data.actionName == "feedback"
      ) {
        const task = {
          type: "continue",
          value: {
            title: "Task module (task/fetch)",
            url: "../assets/taskModule.html",
            fallbackUrl:
              "http://localhost:3978" + "/assets/taskModule.html?fallback=true",
            width: 400,
            height: 600,
          },
        };

        await context.sendActivity({
          type: "invokeResponse",
          value: {
            status: 200,
            body: {
              task,
            },
          },
        });
      }
    }

    await context.sendActivity(
      "Hello! This is a basic response from your Teams bot."
    );
  });
});

expressApp.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// expressApp.get(
//   "/assets/*",
//   restify.plugins.serveStaticFiles(path.join(__dirname, "..", "assets"))
// );
