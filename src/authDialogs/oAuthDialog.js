const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  OAuthPrompt,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const { ConversationState, UserState } = require("botbuilder");

const MAIN_WATERFALL_DIALOG = "MainWaterfallDialog";
const OAUTH_PROMPT = "OAuthPrompt";
const BotConnectionName = "oauth-connection";

class OAuthDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super();

    this.conversationState = conversationState;
    this.userState = userState;
    this.id = "OAuthDialog";

    this.addDialog(
      new OAuthPrompt(OAUTH_PROMPT, {
        connectionName: BotConnectionName,
        text: "Please Sign In to " + BotConnectionName,
        title: "Sign In",
        timeout: 300000,
      })
    );
    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.promptStep.bind(this),
        this.loginStep.bind(this),
      ])
    );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;
    this.dialogState = conversationState.createProperty("DialogState-2");
  }

  async run(context) {
    try {
      console.log(`\n Auth.Run \n`);
      const dialogSet = new DialogSet(this.dialogState);
      dialogSet.add(this);

      const dialogContext = await dialogSet.createContext(context);
      const results = await dialogContext.continueDialog();
      if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
      }

      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
    } catch (error) {
      console.log(`\n Error in auth: ${error} \n`);
    }
  }

  async promptStep(stepContext) {
    return await stepContext.beginDialog(OAUTH_PROMPT);
  }

  async loginStep(stepContext) {
    const tokenResponse = stepContext.result;
    if (tokenResponse) {
      console.log(`\n Token received: ${tokenResponse.token} \n`);
      await stepContext.context.sendActivity("You are now logged in.");
    } else {
      await stepContext.context.sendActivity(
        "Login was not successful please try again."
      );
    }
    return await stepContext.endDialog();
  }

  async logout(context) {
    const userTokenClient = context.turnState.get(
      // @ts-ignore
      context.adapter.UserTokenClientKey
    );

    const { activity } = context;
    await userTokenClient.signOutUser(
      activity.from.id,
      BotConnectionName,
      activity.channelId
    );

    await context.sendActivity("You have been signed out.");
  }
}

module.exports = {
  OAuthDialog,
  BotConnectionName,
};
