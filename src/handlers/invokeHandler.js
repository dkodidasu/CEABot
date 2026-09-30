const { type } = require("express/lib/response");
const { sendAsyncMessage } = require("../utils/asyncMessaging");
const { getBFToken } = require("./tokenHandler");

const InputCard = {
  contentType: "application/vnd.microsoft.card.adaptive",
  content: {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
      {
        type: "TextBlock",
        text: "Card 1",
      },
      {
        type: "ColumnSet",
        columns: [
          {
            type: "Column",
            items: [
              {
                type: "Image",
                style: "Person",
                url: "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
                size: "Small",
              },
            ],
            width: "auto",
          },
          {
            type: "Column",
            items: [
              {
                type: "TextBlock",
                weight: "Bolder",
                text: "Matt Hidinger",
                wrap: true,
              },
              {
                type: "TextBlock",
                spacing: "None",
                text: "Created {{DATE(2017-02-14T06:08:39Z,SHORT)}}",
                isSubtle: true,
                wrap: true,
              },
            ],
            width: "stretch",
          },
        ],
      },
      {
        type: "FactSet",
        facts: [
          {
            title: "Fact 1",
            value: "Value 1",
          },
          {
            title: "Fact 2",
            value: "Value 2",
          },
        ],
      },
      {
        id: "inputText",
        type: "Input.Text",
        label: "Enter text 1",
        placeholder: "Enter text 1",
      },
      {
        id: "inputNumber",
        type: "Input.Number",
        label: "Enter number 1",
        placeholder: "Enter number 1",
      },
      {
        id: "inputDate",
        type: "Input.Date",
        label: "Enter date 1",
        placeholder: "Enter date 1",
      },
      {
        id: "inputTime",
        type: "Input.Time",
        label: "Enter time 1",
        placeholder: "Enter time 1",
      },
      {
        id: "inputToggle",
        type: "Input.Toggle",
        title: "Enter toggle 1",
        label: "Enter toggle 1",
      },
      {
        id: "inputChoice",
        type: "Input.ChoiceSet",
        choices: [
          {
            title: "Choice 1",
            value: "Choice 1",
          },
          {
            title: "Choice 2",
            value: "Choice 2",
          },
          {
            title: "Choice 3",
            value: "Choice 3",
          },
        ],
        label: "Enter choice 1",
        placeholder: "Enter choice 1",
      },
      {
        id: "inputChoiceRadio",
        type: "Input.ChoiceSet",
        style: "Expanded",
        choices: [
          {
            title: "Choice 1",
            value: "Choice 1",
          },
          {
            title: "Choice 2",
            value: "Choice 2",
          },
          {
            title: "Choice 3",
            value: "Choice 3",
          },
        ],
        label: "Enter expanded choice 1",
        placeholder: "Enter expanded choice 1",
      },
      {
        columns: [
          {
            items: [
              {
                color: null,
                horizontalAlignment: null,
                isSubtle: false,
                maxLines: 0,
                size: null,
                text: "Project",
                weight: "bolder",
                wrap: false,
                separator: false,
                type: "TextBlock",
              },
              {
                choices: [
                  {
                    title: "INBOX",
                    value: "0",
                  },
                  {
                    title: "My Project",
                    value: "505401",
                  },
                ],
                isMultiSelect: false,
                style: null,
                value: "505401",
                isRequired: false,
                id: "project",
                separator: false,
                type: "Input.ChoiceSet",
              },
              {
                choices: [
                  {
                    title: "Quadrant 1",
                    value: "0",
                  },
                  {
                    title: "Quadrant 2",
                    value: "1",
                  },
                  {
                    title: "Quadrant 3",
                    value: "2",
                  },
                  {
                    title: "Quadrant 4",
                    value: "3",
                  },
                ],
                isMultiSelect: false,
                style: null,
                value: "3",
                isRequired: false,
                id: "quadrant",
                separator: false,
                type: "Input.ChoiceSet",
              },
            ],
            separator: false,
            type: "Column",
          },
          {
            items: [
              {
                color: null,
                horizontalAlignment: null,
                isSubtle: false,
                maxLines: 0,
                size: null,
                text: "Due Date (optional)",
                weight: "bolder",
                wrap: false,
                separator: false,
                type: "TextBlock",
              },
              {
                placeholder: "Enter due date",
                isRequired: false,
                id: "dueDate",
                separator: false,
                type: "Input.Date",
              },
              {
                placeholder: "Enter due time",
                isRequired: false,
                id: "dueDateTime",
                separator: false,
                type: "Input.Time",
              },
            ],
            separator: false,
            type: "Column",
          },
        ],
        separator: false,
        type: "ColumnSet",
      },
    ],
    actions: [
      {
        type: "Action.Submit",
        title: "Next Task Card",
        data: {
          type: "nextTaskCard",
          value: 1,
        },
      },
      {
        type: "Action.Submit",
        title: "Next Task Url",
        data: {
          type: "nextTaskUrl",
        },
      },
      {
        type: "Action.Submit",
        title: "Submit",
        data: {
          key1: "value1",
          key2: "value2",
        },
      },
      {
        type: "Action.Execute",
        title: "Execute",
        verb: "ActionExecuteVerb",
        data: {
          key3: "value3",
          key4: "value4",
        },
      },
      {
        type: "Action.OpenUrl",
        title: "OpenUrl",
        url: "https://www.google.com",
      },
    ],
  },
};

const ngrokUrl = "https://42da616384f4.ngrok-free.app";
const encodedTaskModuleUrl =
  "https://42da616384f4.ngrok-free.app/assets/taskModule.html";

async function handleInvokes(activity, context, oauthDialog, ssoDialog) {
  if (
    activity.name == "message/fetchTask" &&
    activity.value.data.actionName == "feedback"
  ) {
    const task = {
      type: "continue",
      value: {
        title: "Task module (task/fetch)",
        url: encodedTaskModuleUrl,
        fallbackUrl: `${encodedTaskModuleUrl}?fallback=true`,
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
          //   responseType: "task",
        },
      },
    });
  } else if (activity.name === "message/submitAction") {
    console.log("Your feedback is " + JSON.stringify(activity.value));

    await context.sendActivity({
      type: "invokeResponse",
      value: {
        status: 200,
        body: {},
      },
    });
  } else if (
    activity.name == "task/fetch" &&
    activity.value.data.taskType == "adaptiveCard"
  ) {
    const taskCard = {
      type: "continue",
      value: {
        height: "large",
        width: "large",
        title: "Task Module",
        card: JSON.stringify(InputCard),
      },
    };

    await context.sendActivity({
      type: "invokeResponse",
      value: {
        status: 200,
        body: {
          task: taskCard,
        },
      },
    });
  } else if (
    activity.name == "task/fetch" &&
    activity.value.data.taskType == "url"
  ) {
    const task = {
      type: "continue",
      value: {
        title: "Task module (task/fetch)",
        url: encodedTaskModuleUrl,
        fallbackUrl: `${encodedTaskModuleUrl}?fallback=true`,
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
          //   responseType: "task",
        },
      },
    });
  } else if (activity.name == "task/fetch") {
    const task = {
      type: "continue",
      value: {
        title: "Task module (task/fetch)",
        url: encodedTaskModuleUrl,
        fallbackUrl: `${encodedTaskModuleUrl}?fallback=true`,
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
          //   responseType: "task",
        },
      },
    });
  } else if (activity.name == "signin/verifyState") {
    // await context.sendActivity({
    //   type: "invokeResponse",
    //   value: {
    //     status: 200,
    //   },
    // });

    await ssoDialog.run(context);

    // Send async message using thread ID and state
    // try {
    //   const tokenResponse = await getBFToken();
    //   const accessToken = tokenResponse.access_token;
    //   const threadId = activity.conversation.id;
    //   const state = activity.value.state;
    //   const message = `Sign-in verification completed. State: ${state}`;

    //   const result = await sendAsyncMessage(message, threadId, accessToken);
    //   console.log("Async message sent:", result);
    // } catch (error) {
    //   console.error("Error sending async message:", error);
    // }
  } else if (activity.name === "signin/tokenExchange") {
    await ssoDialog.run(context);
  } else if (activity.name == "invoke" && activity.type == "invoke") {
    await context.sendActivity({
      type: "invokeResponse",
      value: {
        status: 200,
      },
    });
    let accessToken = (await getBFToken()).access_token;
    await sendAsyncMessage(
      "Invoke received",
      activity.conversation.id,
      accessToken
    );
  }
}

module.exports = handleInvokes;
