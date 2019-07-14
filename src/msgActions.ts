import { ActionOption } from "./client";
import { Message } from "discord.js";
import { Audio } from "./actions";
const audio = new Audio();

const Options: ActionOption[] = [
  {
    command: "play",
    action: (message: Message): void => {
      console.log("play", message.content);
      audio.play(message);
    }
  },
  {
    command: "stop",
    action: (message: Message): void => {
      console.log("stop", message.content);
      audio.stop(message);
    }
  },
  {
    command: "next",
    action: (message: Message): void => {
      console.log("next", message.content);
      audio.next(message);
    }
  },
  {
    command: "resume",
    action: (message: Message): void => {
      console.log("resume", message.content);
      audio.resume(message);
    }
  },
  {
    command: "pause",
    action: (message: Message): void => {
      console.log("pause", message.content);
      audio.pause(message);
    }
  }
];

export default Options;
