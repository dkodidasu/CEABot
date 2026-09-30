const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  OAuthPrompt,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const { ConversationState, TurnContext, UserState } = require("botbuilder");

const SSO_AUTH_DIALOG = "SSOAuthDialog";
const MAIN_WATERFALL_DIALOG = "MainWaterfallDialog";
const OAUTH_PROMPT = "OAuthPrompt";
const SSO_CONNECTION_NAME = "sso-connection";

class SSOAuthDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super(SSO_AUTH_DIALOG);

    this.conversationState = conversationState;
    this.userState = userState;

    this.addDialog(
      new OAuthPrompt(OAUTH_PROMPT, {
        connectionName: SSO_CONNECTION_NAME,
        title: `Sign in to ${SSO_CONNECTION_NAME}`,
        text: `Please sign in to ${SSO_CONNECTION_NAME} to continue.`,
      })
    );
    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.promptStep.bind(this),
        this.loginStep.bind(this),
      ])
    );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;
    this.dialogState = conversationState.createProperty("DialogState-1");
  }

  /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} context
   * @param {boolean} skip
   */
  async run(context, skip) {
    try {
      console.log("SSODialog.run");
      const dialogSet = new DialogSet(this.dialogState);
      dialogSet.add(this);

      const dialogContext = await dialogSet.createContext(context);
      if (skip) await dialogContext.cancelAllDialogs();
      const results = await dialogContext.continueDialog();
      console.log("SSODialog.run - results.status: ", results.status);
      if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
      }

      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
    } catch (error) {
      console.log(`\n Error in auth:\n`, error);
      // await context.sendActivity("Sorry, something went wrong.");
    }
  }

  async promptStep(stepContext) {
    console.log("SSODialog.promptStep");
    return await stepContext.beginDialog(OAUTH_PROMPT);
  }

  async loginStep(stepContext) {
    console.log("SSODialog.loginStep");
    // Get the token from the previous step. Note that we could also have gotten the
    // token directly from the prompt itself. There is an example of this in the next method.
    const tokenResponse = stepContext.result;
    if (tokenResponse) {
      console.log(`\n Token received: ${tokenResponse.token} \n`);
      await stepContext.context.sendActivity("You are now logged in.");
    } else {
      await stepContext.context.sendActivity(
        "Login was not successful please try again."
      );
    }
    return await stepContext.cancelAllDialogs();
  }

  async logout(context) {
    const userTokenClient = context.turnState.get(
      context.adapter.UserTokenClientKey
    );

    const { activity } = context;
    await userTokenClient.signOutUser(
      activity.from.id,
      SSO_CONNECTION_NAME,
      activity.channelId
    );

    await context.sendActivity("You have been signed out.");
  }

  async tokenExchange(context) {
    const userTokenClient = context.turnState.get(
      context.adapter.UserTokenClientKey
    );

    console.log({ token: context.activity?.value?.token });

    try {
      const tokenResponse = await userTokenClient.exchangeToken(
        context.activity?.from?.id,
        SSO_CONNECTION_NAME,
        context.activity?.channelId,
        { token: context.activity?.value?.token }
      );

      console.log("Token exchange response: ", tokenResponse);

      if (tokenResponse.token) {
        await context.sendActivity("You are now logged in.");
      } else {
        await context.sendActivity(
          "Login was not successful please try again."
        );
      }
    } catch (error) {
      console.log("Token exchange error: ", error);
    }
  }
}

module.exports = {
  SSOAuthDialog,
  SSO_CONNECTION_NAME,
};
