import { Client, Message } from "discord.js";
import { ActionOption, Bot, BotPlugin } from "./types";
export * from "discord.js";
export * from "./types";

export default class BotClient extends Client {
  public client: Client;
  public msgActions: ActionOption[] = [];
  public plugins!: { [key: string]: BotPlugin };
  private commandList: string[] = [];

  public constructor(payload: Bot) {
    super();
    this.client = new Client();
    this.msgActions = payload.msgActions;
    this.commandList = this.msgActions.map((action: ActionOption): string => {
      return action.command;
    });
    this.registerEvent();
    this.readyMsg();
  }

  public login(token: string): Promise<string> {
    return this.client.login(token);
  }

  private registerEvent(): void {
    this.client.on("message", (message: Message): void => {
      const [command, ...content] = message.content.split(" ");
      message.content = content.join(" ");
      this.help(command, message);
      const idx = this.commandList.indexOf(command);
      if (idx !== -1) this.msgActions[idx].action(message);
    });
  }

  private readyMsg(): void {
    this.client.on("ready", (): void => {
      console.log("start bot");
    });
  }

  private help(command: string, message: Message): void {
    if (command === "!!help") {
      const helpMsg = this.msgActions
        .map((action: ActionOption): string => {
          return `${action.command}: ${
            action.comment ? action.comment : "説明ないわ～"
          }`;
        })
        .join("\n");
      message.reply("\n" + helpMsg);
    }
  }
}
