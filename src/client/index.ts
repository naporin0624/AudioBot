import { Client, Message } from "discord.js";
import { ActionOption, Bot, BotPlugin, Store } from "./types";
export * from "discord.js";
export * from "./types";

export default class BotClient extends Client {
  public client: Client;
  public msgActions?: ActionOption[];
  public store!: Store;
  public plugins!: { [key: string]: BotPlugin };

  public constructor(payload?: Bot) {
    super();
    this.client = new Client();
    if (payload && payload.msgActions) {
      this.msgActions = payload.msgActions;
      this.registerEvent();
    }
    this.readyMsg();
  }

  public login(token: string): Promise<string> {
    return this.client.login(token);
  }

  private registerEvent(): void {
    this.client.on("message", (message: Message): void => {
      const [command, ...content] = message.content.split(" ");
      message.content = content.join(" ");
      const idx = this.commandList.indexOf(command);
      if (idx !== -1 && this.msgActions) this.msgActions[idx].action(message);
    });
  }

  private get commandList(): string[] {
    if (!this.msgActions) return [];
    return this.msgActions.map((hook: ActionOption): string => {
      return hook.command;
    });
  }

  private readyMsg(): void {
    this.client.on("ready", (): void => {
      console.log("start bot");
    });
  }
}
