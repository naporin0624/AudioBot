import { ActionOption } from "./client";
import { Message } from "discord.js";
import { Audio } from "./actions";
const audio = new Audio();

const Options: ActionOption[] = [
  {
    command: "play",
    comment: "play [niconico, youtube, mp3]",
    action: (message: Message): void => {
      console.log("play", message.content);
      audio.play(message);
    }
  },
  {
    command: "stop",
    comment: "再生リストを削除して停止させます",
    action: (message: Message): void => {
      console.log("stop", message.content);
      audio.stop(message);
    }
  },
  {
    command: "next",
    comment: "次の曲に飛びます",
    action: (message: Message): void => {
      console.log("next", message.content);
      audio.next(message);
    }
  },
  {
    command: "resume",
    comment: "一時停止した曲を再開させます",
    action: (message: Message): void => {
      console.log("resume", message.content);
      audio.resume(message);
    }
  },
  {
    command: "pause",
    comment: "曲を一時させます",
    action: (message: Message): void => {
      console.log("pause", message.content);
      audio.pause(message);
    }
  }
];

export default Options;
