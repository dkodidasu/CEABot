const { StreamingResponse } = require("@microsoft/teams-ai");

const genericAdaptiveCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: "I support following messages, feel free to click and explore functionality",
    },
    {
      type: "Container",
      items: [
        {
          id: "text-1",
          type: "Input.Text",
        },
      ],
    },
    {
      type: "Container",
      items: [
        {
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
          ],
          placeholder: "Placeholder text",
        },
        {
          type: "ActionSet",
          actions: [
            {
              type: "Action.Submit",
              title: "OK",
            },
          ],
        },
      ],
    },

    {
      type: "TextBlock",
      text: "Here are some images:",
      isVisible: false,
      id: "textToToggle",
    },
  ],
  actions: [
    {
      type: "Action.ShowCard",
      title: "ShowCard",
      card: {
        type: "AdaptiveCard",
        body: [
          {
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
            ],
            placeholder: "Placeholder text",
          },
          {
            type: "Input.Text",
            id: "comment",
            isMultiline: true,
            label: "Add a comment",
          },
        ],
        actions: [
          {
            type: "Action.Submit",
            title: "OK",
          },
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      },
    },
    {
      type: "Action.OpenUrl",
      title: "OpenUrl",
      url: "https://adaptivecards.io/designer",
      role: "Button",
    },
    {
      type: "Action.Submit",
      title: "Invoke",
      data: {
        msteams: {
          type: "invoke",
        },
      },
    },
    {
      type: "Action.Submit",
      title: "Invoke_Without_data",
    },
    {
      type: "Action.Submit",
      title: "Invoke_With_stringData",
      data: "Random string",
    },
    {
      type: "Action.Submit",
      title: "Invoke_With_Json_data",
      data: {
        text: "sometext",
      },
    },
    {
      type: "Action.Submit",
      title: "MessageBackWithDisplayText",
      data: {
        msteams: {
          type: "messageBack",
          displayText: "I clicked this button",
          text: "User just clicked the MessageBack button",
          value: '{"property": "propertyValue" }',
        },
      },
    },
    {
      type: "Action.Submit",
      title: "MessageBackWithoutDisplayText",
      data: {
        msteams: {
          type: "messageBack",
          text: "User just clicked the MessageBack button",
          value: '{"property": "propertyValue" }',
        },
      },
    },
    {
      type: "Action.Submit",
      title: "IMBack",
      data: {
        msteams: {
          type: "Imback",
          title: "Get me water title",
          value: "Get me some water",
        },
      },
    },
    {
      type: "Action.ToggleVisibility",
      title: "Action.ToggleVisibility",
      targetElements: ["textToToggle"],
    },
    {
      type: "Action.Execute",
      title: "Action.Execute",
    },
    {
      data: {
        msteams: {
          type: "invoke",
          value: { type: "task/fetch", taskType: "url" },
        },
        key1: "value1",
        key2: { subkey: "subvalue" },
      },
      title: "Task Url",
      type: "Action.Submit",
    },
    {
      data: {
        msteams: {
          type: "invoke",
          value: { type: "task/fetch", taskType: "adaptiveCard" },
        },
        key1: "value1",
        key2: { subkey: "subvalue" },
      },
      title: "Task Card",
      type: "Action.Submit",
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.4",
};

function asyncStream(context) {
  return new Promise((resolve, reject) => {
    const stream = new StreamingResponse(context);
    setTimeout(() => {
      stream.queueInformativeUpdate("Looking for responses");
    }, 2 * 1000);

    setTimeout(() => {
      stream.queueInformativeUpdate("finding best answer for you");
    }, 4 * 1000);

    const mockTextChuncks = ["This ", "is a ", "streaming message"];
    const attachment = [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: genericAdaptiveCard,
      },
    ];
    setTimeout(
      () => sendStream(stream, resolve, mockTextChuncks, attachment, -1),
      8 * 1000
    );
  });
}

function sendStream(
  streaming,
  resolve,
  streamArray,
  attachments,
  index,
  finalText,
  citation
) {
  index++;
  streaming.queueTextChunk(streamArray[index], citation);
  streaming.waitForQueue().then(() => {
    if (index < streamArray.length - 1) {
      setTimeout(
        () =>
          sendStream(
            streaming,
            resolve,
            streamArray,
            attachments,
            index,
            finalText,
            citation
          ),
        1 * 1000
      );
    } else {
      if (attachments) {
        streaming.setAttachments(attachments);
      }
      streaming.setGeneratedByAILabel(true);
      streaming.endStream().then(() => {
        resolve();
      });
    }
  });
}
module.exports = asyncStream;
