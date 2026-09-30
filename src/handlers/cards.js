const ngrokUrl = "https://42da616384f4.ngrok-free.app";

const contentUrl = ngrokUrl + "/assets/taskModule.html";
const websiteUrl = contentUrl + "?fallback=true";
const stageInfo = {
  name: "Stage View",
  websiteUrl,
  contentUrl,
};
const taskInfo = {
  title: "Task Module",
  height: 800,
  width: 600,
  url: contentUrl,
  fallbackUrl: websiteUrl,
};

const actionsAdaptiveCard = {
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
          hint: "Type something",
          placeholder: "Type something",
          label: "Input Text",
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
      type: "Action.OpenUrl",
      title: "OpenUrl-taskModule",
      url: `https://teams.microsoft.com/l/task/8b5303d4-4a51-4255-bba4-5c3cdc0bc131?url=${encodeURI(
        `${ngrokUrl}/assets/taskModule.html`,
      )}`,
    },
    {
      type: "Action.OpenUrl",
      title: "OpenUrl-stageView",
      url: `https://teams.microsoft.com/l/stage/8b5303d4-4a51-4255-bba4-5c3cdc0bc131/0?context=${encodeURI(
        JSON.stringify(stageInfo),
      )}`,
    },
    {
      type: "Action.Submit",
      title: "Invoke",
      data: {
        msteams: {
          type: "invoke",
          key1: "value1",
        },
        key2: { subkey: "subvalue" },
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
      title: "Invoke_With_Json_data",
      data: {
        text: "sometext",
      },
    },
    {
      type: "Action.Submit",
      title: "Submit_StageView",
      data: {
        msteams: {
          type: "invoke",
          value: {
            type: "tab/tabInfoAction",
            tabInfo: stageInfo,
          },
        },
      },
      fallback: {
        type: "Action.OpenUrl",
        title: "StageFallback_OpenUrl",
        url: websiteUrl,
      },
    },
    {
      type: "Action.Submit",
      title: "Submit_taskModule",
      data: {
        msteams: {
          type: "invoke",
          value: {
            type: "task/fetch",
            tabInfo: taskInfo,
          },
        },
      },
    },
    {
      data: {
        msteams: {
          type: "invoke",
          value: { type: "task/fetch", taskType: "url", key3: "value3" },
          key1: "value1",
        },
        key2: { subkey: "subvalue" },
      },
      title: "Task Url",
      type: "Action.Submit",
    },
    {
      data: {
        msteams: {
          type: "invoke",
          value: {
            type: "task/fetch",
            taskType: "adaptiveCard",
            key3: "value3",
          },
          key1: "value1",
        },
        key2: { subkey: "subvalue" },
      },
      title: "Task Card",
      type: "Action.Submit",
    },
    {
      type: "Action.Execute",
      verb: "pmEdit",
      isVisible: false,
      id: "pmEdit",
      title: "Action Execute",
      data: {
        kind: "edit",
        item_id: 1107953905,
      },
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.4",
  speak: "card arrived",
};

const genericAdaptiveCard = {
  type: "AdaptiveCard",
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.6",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: "I support following messages, feel free to click and explore functionality",
    },
    {
      type: "TextBlock",
      text: "Visit the [Adaptive Cards website](https://42da616384f4.ngrok-free.app) for more info.",
      wrap: true,
    },
    {
      type: "Container",
      items: [
        {
          id: "text-1",
          type: "Input.Text",
          hint: "Type something",
          placeholder: "Type something",
          label: "Input Text",
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
      type: "Action.OpenUrl",
      title: "OpenUrl-taskModule",
      url: `https://teams.microsoft.com/l/task/8b5303d4-4a51-4255-bba4-5c3cdc0bc131?url=${encodeURI(
        `${ngrokUrl}/assets/taskModule.html`,
      )}`,
    },
    {
      type: "Action.OpenUrl",
      title: "OpenUrl-stageView",
      url: `https://teams.microsoft.com/l/stage/8b5303d4-4a51-4255-bba4-5c3cdc0bc131/0?context=${encodeURI(
        JSON.stringify(stageInfo),
      )}`,
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
      data: {
        msteams: {
          type: "task/fetch",
          commandId: "createTask",
        },
        commandId: "createTask",
        sub_location: "Bot",
      },
      title: "Submit_taskFetch_url",
      type: "Action.Submit",
    },
    {
      data: {
        msteams: {
          type: "task/fetch",
          commandId: "createTask",
        },
        commandId: "createTask",
        sub_location: "Bot",
      },
      title: "Create task",
      type: "Action.Submit",
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

const createTaskAdaptiveCard = {
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
          hint: "Type something",
          placeholder: "Type something",
          label: "Input Text",
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
      data: {
        msteams: {
          type: "task/fetch",
        },
        commandId: "createTask",
        sub_location: "Bot",
      },
      title: "Create task incorrect",
      type: "Action.Submit",
    },
    {
      data: {
        msteams: {
          type: "invoke",
          value: { type: "task/fetch", taskType: "url" },
        },
        commandId: "createTask",
        sub_location: "Bot",
      },
      title: "Create task correct",
      type: "Action.Submit",
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
      type: "Action.Submit",
      title: "Action.Submit",
      verb: "action_submit_task_module",
      data: {
        msteams: {
          type: "task/fetch",
          verb: "action_submit_task_module",
        },
        verb: "action_submit_task_module",
        data_1: 123,
        data_2: "abc",
      },
    },
    {
      type: "Action.Submit",
      title: "Invoke",
      data: {
        msteams: {
          type: "invoke",
          key1: "value1",
        },
        key2: { subkey: "subvalue" },
      },
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.4",
};

const inlineStageViewCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      text: "Dummy text",
      isVisible: false,
      id: "textToToggle",
    },
    {
      inlines: [
        {
          type: "TextRun",
          size: "small",
          isSubtle: true,
          text: "StageView - AppId",
          selectAction: {
            url: `https://teams.microsoft.com/l/stage/8b5303d4-4a51-4255-bba4-5c3cdc0bc131/0?context=${encodeURI(
              JSON.stringify(stageInfo),
            )}`,
            title: "StageView - AppId",
            type: "Action.OpenUrl",
          },
          underline: true,
        },
        {
          type: "TextRun",
          size: "small",
          isSubtle: true,
          text: "StageView - ManifestId",
          selectAction: {
            url: `https://teams.microsoft.com/l/stage/8b5303d4-4a51-4255-bba4-5c3cdc0bc131/0?context=${encodeURI(
              JSON.stringify(stageInfo),
            )}`,
            title: "StageView - ManifestId",
            type: "Action.OpenUrl",
          },
          underline: true,
        },
      ],
      spacing: "small",
      type: "RichTextBlock",
    },
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      url: `https://teams.microsoft.com/l/stage/3f6f4708-0022-47b6-ac30-5b5a8624c736/0?context=${encodeURI(
        JSON.stringify(stageInfo),
      )}`,
      title: "StageView - AppId",
      msteams: {
        feedback: {
          hide: true,
        },
      },
    },
    {
      type: "Action.OpenUrl",
      url: `https://teams.microsoft.com/l/stage/8b5303d4-4a51-4255-bba4-5c3cdc0bc131/0?context=${encodeURI(
        JSON.stringify(stageInfo),
      )}`,
      title: "StageView - ManifestId",
      msteams: {
        feedback: {
          hide: true,
        },
      },
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.5",
  msTeams: { width: "full" },
};

const inlineTaskModuleCard = {
  contentType: "application/vnd.microsoft.card.adaptive",
  content: {
    body: [
      {
        type: "TextBlock",
        wrap: true,
        text: "This is the first TextBlock",
      },
      // {
      //   type: "RichTextBlock",
      //   inlines: [
      //     {
      //       text: "These are inlines",
      //     },
      //   ],
      // },
    ],
  },
};

const videoAdaptiveCard = {
  contentType: "application/vnd.microsoft.card.adaptive",
  content: {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "Media",
        sources: [
          {
            url: "https://www.youtube.com/watch?v=YsqcODOEO-M",
            mimeType: "video/mp4",
          },
        ],
      },
      {
        type: "TextBlock",
        text: "Telegraph Road - Dire Straits",
        size: "Large",
        weight: "Bolder",
        wrap: true,
      },
      {
        type: "TextBlock",
        spacing: "None",
        text: "Cover by David Claux",
        wrap: true,
      },
    ],
  },
};

const messageBackCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "Container",
      items: [
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "ActionSet",
                  actions: [
                    {
                      type: "Action.Submit",
                      title: "messageBack-value-stringjson",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "User just clicked the MessageBack button",
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-value-json",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "User just clicked the MessageBack button",
                          value: {
                            property: "propertyValue",
                          },
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-value-string",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "User just clicked the MessageBack button",
                          value: "property",
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-value-null",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "User just clicked the MessageBack button",
                          value: null,
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-value-notfound",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "User just clicked the MessageBack button",
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-value-null",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "User just clicked the MessageBack button",
                          value: null,
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-text-null",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: null,
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-text-empty",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "",
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-text-notfound",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-displayText-null",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: null,
                          text: "User just clicked the MessageBack button",
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-displayText-empty",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "",
                          text: "User just clicked the MessageBack button",
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-text-value-null",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked the button",
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-text-value-displayText-null",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-displayText-notfound",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          text: "User just clicked the MessageBack button",
                          value: '{"property": "propertyValue" }',
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "messageBack-icm-testcase",
                      data: {
                        msteams: {
                          type: "messageBack",
                          title: "My MessageBack button",
                          displayText: "I clicked this button",
                          text: "",
                          value: {
                            3: "Add",
                            4: "test",
                            5: "test",
                            actionSubmitId: "Send a Request Email to Owner",
                          },
                        },
                      },
                    },
                    {
                      type: "Action.Submit",
                      title: "imBack",
                      data: {
                        msteams: {
                          type: "imBack",
                          title: "show me everything title",
                          value: "show me everything",
                        },
                      },
                    },
                  ],
                  spacing: "Medium",
                },
              ],
            },
          ],
          spacing: "Medium",
        },
      ],
      spacing: "ExtraLarge",
      horizontalAlignment: "Center",
      height: "stretch",
      verticalContentAlignment: "Center",
    },
  ],
  $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.5",
};

const customAdaptiveCard = {
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: "AdaptiveCard",
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      text: "Planned Costs for the Project Bluebird",
      size: "large",
      weight: "bolder",
      wrap: true,
      isSubtle: false,
      color: "default",
      spacing: "default",
    },
    {
      type: "TextBlock",
      text: "These are the estimated costs for airfare and hotel/lodging",
      size: "default",
      weight: "default",
      wrap: true,
      isSubtle: true,
      color: "default",
      spacing: "none",
    },
    {
      type: "Container",
      items: [
        {
          type: "TextBlock",
          text: "Airfare",
          size: "default",
          weight: "bolder",
          wrap: true,
          isSubtle: false,
          color: "default",
          spacing: "none",
        },
        {
          type: "TextBlock",
          text: "7,500 USD",
          size: "default",
          weight: "default",
          wrap: true,
          isSubtle: false,
          color: "default",
          spacing: "none",
        },
      ],
      spacing: "large",
    },
    {
      type: "Container",
      items: [
        {
          type: "TextBlock",
          text: "Hotel/Lodging",
          size: "default",
          weight: "bolder",
          wrap: true,
          isSubtle: false,
          color: "default",
          spacing: "none",
        },
        {
          type: "TextBlock",
          text: "2,270 USD",
          size: "default",
          weight: "default",
          wrap: true,
          isSubtle: false,
          color: "default",
          spacing: "none",
        },
      ],
      spacing: "large",
    },
    {
      type: "Container",
      items: [
        {
          type: "TextBlock",
          text: "Total (excluding meals and transportation)",
          size: "default",
          weight: "bolder",
          wrap: true,
          isSubtle: false,
          color: "default",
          spacing: "none",
        },
        {
          type: "TextBlock",
          text: "10,812 USD",
          size: "default",
          weight: "default",
          wrap: true,
          isSubtle: false,
          color: "default",
          spacing: "none",
        },
      ],
      spacing: "large",
    },
  ],
  actions: [],
};

const collapsibleCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "ColumnSet",
      columns: [
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "RichTextBlock",
              inlines: [
                {
                  type: "TextRun",
                  text: "Prompt tips",
                  selectAction: {
                    type: "Action.ToggleVisibility",
                    targetElements: ["promptTips", "chevronDown", "chevronUp"],
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "Icon",
              name: "ChevronDown",
              size: "xxSmall",
              color: "Accent",
              id: "chevronDown",
              selectAction: {
                type: "Action.ToggleVisibility",
                targetElements: ["promptTips", "chevronDown", "chevronUp"],
              },
            },
            {
              type: "Icon",
              name: "ChevronUp",
              size: "xxSmall",
              color: "Accent",
              id: "chevronUp",
              isVisible: false,
              selectAction: {
                type: "Action.ToggleVisibility",
                targetElements: ["promptTips", "chevronDown", "chevronUp"],
              },
            },
          ],
          verticalContentAlignment: "Bottom",
          spacing: "ExtraSmall",
        },
      ],
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.6",
};

const collapsibleCard1 = {
  type: "AdaptiveCard",
  id: "GroundingSourceCard",
  body: [
    {
      type: "TextBlock",
      text: "A new conversation has started. Which grounding source do you want to use to generate responses in this conversation?",
      wrap: true,
    },
    {
      type: "TextBlock",
      text: "Firm’s clauses",
      wrap: true,
      spacing: "ExtraLarge",
      separator: true,
      weight: "bolder",
    },
    {
      type: "TextBlock",
      text: "The response will be based on your firm’s clauses",
      wrap: true,
      spacing: "Small",
    },
    {
      type: "ActionSet",
      actions: [
        {
          type: "Action.Submit",
          title: "Use firm’s clauses",
          data: {
            command: "firms_content",
            source: "henchman",
            sourceKey: "6b0e67e5-46e3-4ff4-b645-be6dcd5f9931",
          },
          msTeams: {
            feedback: {
              hide: true,
            },
          },
          isEnabled: true,
        },
      ],
      spacing: "Small",
    },
    {
      type: "TextBlock",
      text: "Protégé Vaults",
      wrap: true,
      spacing: "ExtraLarge",
      separator: true,
      weight: "bolder",
    },
    {
      type: "TextBlock",
      text: "The response will be based on your vaults created in Protégé™",
      wrap: true,
      spacing: "small",
    },
    {
      type: "ActionSet",
      id: "vaultButton",
      actions: [
        {
          type: "Action.ToggleVisibility",
          title: "Use Protégé Vaults",
          targetElements: ["vaultSection", "vaultButton"],
          isEnabled: true,
        },
      ],
      spacing: "Small",
      isVisible: true,
    },
    {
      type: "Container",
      id: "vaultSection",
      isVisible: false,
      items: [
        {
          type: "TextBlock",
          text: "Use an existing vault:",
          wrap: true,
        },
        {
          type: "Input.ChoiceSet",
          id: "vaultSelection",
          placeholder: "Select a Vault",
          choices: [
            {
              title: "Wall Mart",
              value:
                "Wall Mart;fb5b2794-6ea2-479e-af1e-753b5d283783/ce77096c-326c-4543-a4d6-af6517c87f15/ec9faf62-9fd0-4b06-be36-263ca1dfb788",
            },
          ],
          style: "compact",
        },
        {
          type: "ActionSet",
          actions: [
            {
              type: "Action.Submit",
              title: "Apply",
              data: {
                command: "firms_content",
                source: "dbotf",
              },
              msTeams: {
                feedback: {
                  hide: true,
                },
              },
            },
            {
              type: "Action.Submit",
              title: "Clear",
              data: {
                command: "clear_vault",
              },
              msTeams: {
                feedback: {
                  hide: true,
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: "ColumnSet",
      separator: true,
      spacing: "ExtraLarge",
      columns: [
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "Icon",
              name: "info",
              size: "xxSmall",
              color: "Accent",
            },
          ],
          verticalContentAlignment: "Center",
          spacing: "ExtraSmall",
        },
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "RichTextBlock",
              inlines: [
                {
                  type: "TextRun",
                  text: "Learn more",
                  selectAction: {
                    type: "Action.ToggleVisibility",
                    targetElements: [
                      "learnMoreText",
                      "learnMoreIconDown",
                      "learnMoreIconUp",
                    ],
                  },
                },
              ],
            },
          ],
          spacing: "ExtraSmall",
        },
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "Icon",
              name: "chevronDown",
              size: "xxSmall",
              color: "Accent",
              id: "learnMoreIconDown",
              selectAction: {
                type: "Action.ToggleVisibility",
                targetElements: [
                  "learnMoreText",
                  "learnMoreIconDown",
                  "learnMoreIconUp",
                ],
              },
            },
            {
              type: "Icon",
              name: "chevronUp",
              size: "xxSmall",
              color: "Accent",
              id: "learnMoreIconUp",
              isVisible: false,
              selectAction: {
                type: "Action.ToggleVisibility",
                targetElements: [
                  "learnMoreText",
                  "learnMoreIconDown",
                  "learnMoreIconUp",
                ],
              },
            },
          ],
          verticalContentAlignment: "Bottom",
          spacing: "ExtraSmall",
        },
      ],
    },
    {
      type: "Container",
      id: "learnMoreText",
      isVisible: false,
      items: [
        {
          type: "TextBlock",
          text: "Selected grounding source will be applied for this entire conversation. You can change your source by starting a new conversation. When a new conversation starts, the source will change back to Lexis+&trade; as the default conversation source.",
          wrap: true,
          spacing: "medium",
        },
      ],
    },
  ],
  msteams: {
    width: "Full",
  },
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.6",
};

const collapsibleCard2 = {
  type: "AdaptiveCard",
  id: "GroundingSourceCard",
  body: [
    {
      type: "TextBlock",
      text: "A new conversation has started. Which grounding source do you want to use to generate responses in this conversation?",
      wrap: true,
    },
    {
      type: "TextBlock",
      text: "Firm’s clauses",
      wrap: true,
      spacing: "ExtraLarge",
      separator: true,
      weight: "bolder",
    },
    {
      type: "TextBlock",
      text: "The response will be based on your firm’s clauses",
      wrap: true,
      spacing: "Small",
    },
    {
      type: "ActionSet",
      actions: [
        {
          type: "Action.Submit",
          title: "Use firm’s clauses",
          data: {
            command: "firms_content",
            source: "henchman",
            sourceKey: "6b0e67e5-46e3-4ff4-b645-be6dcd5f9931",
          },
          msTeams: {
            feedback: {
              hide: true,
            },
          },
          isEnabled: true,
        },
      ],
      spacing: "Small",
    },
    {
      type: "TextBlock",
      text: "Protégé Vaults",
      wrap: true,
      spacing: "ExtraLarge",
      separator: true,
      weight: "bolder",
    },
    {
      type: "TextBlock",
      text: "The response will be based on your vaults created in Protégé™",
      wrap: true,
      spacing: "small",
    },
    {
      type: "ActionSet",
      id: "vaultButton",
      actions: [
        {
          type: "Action.ToggleVisibility",
          title: "Use Protégé Vaults",
          targetElements: ["vaultSection", "vaultButton"],
          isEnabled: true,
        },
      ],
      spacing: "Small",
      isVisible: true,
    },
    {
      type: "Container",
      id: "vaultSection",
      isVisible: false,
      items: [
        {
          type: "TextBlock",
          text: "Use an existing vault:",
          wrap: true,
        },
        {
          type: "Input.ChoiceSet",
          id: "vaultSelection",
          placeholder: "Select a Vault",
          choices: [
            {
              title: "Wall Mart",
              value:
                "Wall Mart;fb5b2794-6ea2-479e-af1e-753b5d283783/ce77096c-326c-4543-a4d6-af6517c87f15/ec9faf62-9fd0-4b06-be36-263ca1dfb788",
            },
          ],
          style: "compact",
        },
        {
          type: "ActionSet",
          actions: [
            {
              type: "Action.Submit",
              title: "Apply",
              data: {
                command: "firms_content",
                source: "dbotf",
              },
              msTeams: {
                feedback: {
                  hide: true,
                },
              },
            },
            {
              type: "Action.Submit",
              title: "Clear",
              data: {
                command: "clear_vault",
              },
              msTeams: {
                feedback: {
                  hide: true,
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: "ColumnSet",
      separator: true,
      spacing: "ExtraLarge",
      columns: [
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "Icon",
              name: "info",
              size: "xxSmall",
              color: "Accent",
            },
          ],
          verticalContentAlignment: "Center",
          spacing: "ExtraSmall",
        },
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "RichTextBlock",
              inlines: [
                {
                  type: "TextRun",
                  text: "Learn more",
                  selectAction: {
                    type: "Action.ToggleVisibility",
                    targetElements: [
                      "learnMoreText",
                      "learnMoreIconDown",
                      "learnMoreIconUp",
                    ],
                  },
                },
              ],
            },
          ],
          spacing: "ExtraSmall",
        },
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "Icon",
              name: "chevronDown",
              size: "xxSmall",
              color: "Accent",
              id: "learnMoreIconDown",
              selectAction: {
                type: "Action.ToggleVisibility",
                targetElements: [
                  "learnMoreText",
                  "learnMoreIconDown",
                  "learnMoreIconUp",
                ],
              },
            },
            {
              type: "Icon",
              name: "chevronUp",
              size: "xxSmall",
              color: "Accent",
              id: "learnMoreIconUp",
              isVisible: false,
              selectAction: {
                type: "Action.ToggleVisibility",
                targetElements: [
                  "learnMoreText",
                  "learnMoreIconDown",
                  "learnMoreIconUp",
                ],
              },
            },
          ],
          verticalContentAlignment: "Bottom",
          spacing: "ExtraSmall",
        },
      ],
    },
    {
      type: "Container",
      id: "learnMoreText",
      isVisible: false,
      items: [
        {
          type: "TextBlock",
          text: "Selected grounding source will be applied for this entire conversation. You can change your source by starting a new conversation. When a new conversation starts, the source will change back to Lexis+&trade; as the default conversation source.",
          wrap: true,
          spacing: "medium",
        },
      ],
    },
  ],
  msteams: {
    width: "Full",
  },
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.6",
};

const imageWithUrl = {
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: "AdaptiveCard",
  version: "1.0",
  body: [
    {
      type: "Image",
      url: "https://adaptivecards.io/content/cats/1.png",
      altText: "Cat",
    },
  ],
};

const imageWithBase64 = {
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: "AdaptiveCard",
  version: "1.0",
  body: [
    {
      type: "Image",
      url: "data:image/webp;base64,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",
      altText: "Cat",
    },
  ],
};

const imageWithBase64Big = {
  type: "AdaptiveCard",
  $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.5",
  body: [
    {
      type: "Container",
      items: [
        {
          type: "Image",
          horizontalAlignment: "Center",
          url: "data:image/png;base64,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+7t5Ubz1W781v/M7v8PFixf5z3brrbfykIc8hPd6r/fiu7/7u3lRvPVbvzW/8zu/w8WLF/nPduutt/KQhzyE93qv9+K7v/u7eVG89Vu/Nb/zO7/DxYsX+c9266238pCHPIT3eq/34ru/+7t5Ubz1W781v/M7v8PFixe56j8Msm2uuuq/wG//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+Y/02//9m/zOq/zOvzVX/0VL/3SL82L4qd/+qd5m7d5G37rt36L137t1+aq/xDItrnqqv8Cv/3bv83rvM7r8Fu/9Vu89mu/Ni+K7/7u7+Z93ud9ePrTn86DH/xg/jP99m//Nq/zOq/Db/3Wb/Har/3avCi++7u/m/d5n/fh6U9/Og9+8IP5z/Tbv/3bvM7rvA6/9Vu/xWu/9mvzovju7/5u3ud93oenP/3pPPjBD+Y/02//9m/zOq/zOvzWb/0Wr/3ar82L4ru/+7t5n/d5H57+9Kfz4Ac/mP9Mv/3bv83rvM7r8Fu/9Vu89mu/Ni+K7/7u7+Z93ud9ePrTn86DH/xg/jP99m//Nq/zOq/Db/3Wb/Har/3avCi++7u/m/d5n/fh6U9/Og9+8IP5z/Tbv/3bvM7rvA6/9Vu/xWu/9mvzovju7/5u3ud93oenP/3pPPjBD+Y/02//9m/zOq/zOvzWb/0Wr/3ar82L4ru/+7t5n/d5H57+9Kfz4Ac/mP9Mv/3bv83rvM7r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/nR2d3f5z3brrbfykIc8hPd+7/fmu77ru/iX7O7u8jqv8zo8/elPZ3d3l/9st956Kw95yEN47/d+b77ru76Lf8nu7i6v8zqvw9Of/nR2d3f5z3brrbfykIc8hPd+7/fmu77ru/iX7O7u8jqv8zo8/elPZ3d3l/9st956Kw95yEN47/d+b77ru76Lf8nu7i6v8zqvw9Of/nR2d3e56j8Msm2uuuq/yEd/9EfzNV/zNTz4wQ/mrd/6rXnrt35rnp+f/umf5ru/+7vZ3d3lu77ru3jv935v/it89Ed/NF/zNV/Dgx/8YN76rd+at37rt+b5+emf/mm++7u/m93dXb7ru76L937v9+a/wkd/9EfzNV/zNTz4wQ/mrd/6rXnrt35rnp+f/umf5ru/+7vZ3d3lu77ru3jv935v/it89Ed/NF/zNV/Dgx/8YN76rd+at37rt+b5+emf/mm++7u/m93dXb7ru76L937v9+a/wkd/9EfzNV/zNTz4wQ/mrd/6rXnrt35rnp+f/umf5ru/+7vZ3d3lu77ru3jv935v/it89Ed/NF/zNV/Dgx/8YN76rd+at37rt+b5+emf/mm++7u/m93dXb7ru76L937v9+a/wkd/9EfzNV/zNTz4wQ/mrd/6rXnrt35rnp+f/umf5ru/+7vZ3d3lu77ru3jv935v/it89Ed/NF/zNV/Dgx/8YN76rd+at37rt+b5+emf/mm++7u/m93dXb7ru76L937v9+a/wkd/9EfzNV/zNTz4wQ/mrd/6rXnrt35rnp+f/umf5ru/+7vZ3d3lu77ru3jv935v/it89Ed/NF/zNV/Dgx/8YN76rd+at37rt+b5+emf/mm++7u/m93dXb7ru76L937v9+aq/zDItrnqqv9Cn/3Zn81Xf/VXc+nSJV6Yl3qpl+KzP/uzeeu3fmv+K332Z382X/3VX82lS5d4YV7qpV6Kz/7sz+at3/qt+a/02Z/92Xz1V381ly5d4oV5qZd6KT77sz+bt37rt+a/0md/9mfz1V/91Vy6dIkX5qVe6qX47M/+bN76rd+a/0qf/dmfzVd/9Vdz6dIlXpiXeqmX4rM/+7N567d+a/4rffZnfzZf/dVfzaVLl3hhXuqlXorP/uzP5q3f+q35r/TZn/3ZfPVXfzWXLl3ihXmpl3opPvuzP5u3fuu35r/SZ3/2Z/PVX/3VXLp0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",
        },
      ],
      spacing: "Medium",
      separator: true,
      horizontalAlignment: "Left",
      verticalContentAlignment: "Center",
      style: "emphasis",
    },
    {
      type: "Container",
      items: [
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "SQL query",
                  wrap: true,
                  style: "default",
                  fontType: "Default",
                  size: "Medium",
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "20px",
              items: [
                {
                  type: "Image",
                  url: "https://adaptivecards.io/content/up.png",
                  id: "arrowUp",
                  isVisible: false,
                  selectAction: {
                    type: "Action.ToggleVisibility",
                    targetElements: [
                      {
                        elementId: "arrowDown",
                        isVisible: true,
                      },
                      {
                        elementId: "arrowUp",
                        isVisible: false,
                      },
                      {
                        elementId: "content",
                        isVisible: false,
                      },
                    ],
                  },
                },
                {
                  type: "Image",
                  url: "https://adaptivecards.io/content/down.png",
                  id: "arrowDown",
                  selectAction: {
                    type: "Action.ToggleVisibility",
                    targetElements: [
                      {
                        elementId: "arrowDown",
                        isVisible: false,
                      },
                      {
                        elementId: "arrowUp",
                        isVisible: true,
                      },
                      {
                        elementId: "content",
                        isVisible: true,
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Container",
          items: [
            {
              type: "CodeBlock",
              codeSnippet:
                "WITH __customers AS\n  (SELECT city,\n          client_id,\n          zip_code\n   FROM ms_teams_demo_db.data.customers),\n     __claims AS\n  (SELECT client_id,\n          date_filed,\n          claim_amount\n   FROM ms_teams_demo_db.data.claims),\n     claims_data AS\n  (SELECT c.zip_code,\n          SUM(cl.claim_amount) AS total_claim_amount,\n          MIN(cl.date_filed) AS start_date,\n          MAX(cl.date_filed) AS end_date\n   FROM __customers AS c\n   INNER JOIN __claims AS cl ON c.client_id = cl.client_id\n   WHERE c.city = 'Austin'\n   GROUP BY c.zip_code)\nSELECT zip_code,\n       total_claim_amount,\n       start_date,\n       end_date\nFROM claims_data\nORDER BY total_claim_amount DESC NULLS LAST -- Generated by Cortex Analyst\n;",
              language: "sql",
              id: "sqlCodeBlock",
            },
          ],
          id: "content",
          spacing: "Small",
          isVisible: false,
        },
      ],
    },
  ],
};

const basicTaskModule = {
  type: "AdaptiveCard",
  version: "1.4",
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  body: [
    {
      type: "TextBlock",
      text: "Click the button below to fetch a task",
      weight: "Bolder",
      size: "Medium",
    },
  ],
  actions: [
    {
      type: "Action.Submit",
      title: "Open Task Module",
      data: {
        msteams: {
          type: "invoke",
          value: {
            type: "task/fetch",
            taskType: "adaptiveCard",
          },
        },
      },
    },
  ],
};

module.exports = {
  collapsibleCard,
  collapsibleCard2,
  collapsibleCard1,
  genericAdaptiveCard,
  actionsAdaptiveCard,
  customAdaptiveCard,
  createTaskAdaptiveCard,
  imageWithUrl,
  imageWithBase64,
  imageWithBase64Big,
  inlineTaskModuleCard,
  inlineStageViewCard,
  messageBackCard,
  videoAdaptiveCard,
  basicTaskModule,
};
