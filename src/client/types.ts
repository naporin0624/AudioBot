import { Message, StreamDispatcher, VoiceConnection } from "discord.js";
import { ReadStream } from "tty";
import { Readable } from "stream";

export interface ActionOption {
  command: string;
  comment?: string;
  action: (message: Message) => void;
}

export interface State {
  dispacker: StreamDispatcher | null;
  connection: VoiceConnection | null;
  musicQue: string[];
}

export interface Actions {
  push: (url: string) => void;
  pop: () => string;
  shuffle: () => void;
}

export interface Store {
  state: State;
  actions: Actions;
}

export interface BotPlugin {
  httpStream: (url: string) => Promise<ReadStream | Readable>;
}

export interface Bot {
  msgActions: ActionOption[];
}
