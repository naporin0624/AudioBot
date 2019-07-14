import { BotPlugin } from "../client";
import ytdl from "ytdl-core";
import { Readable } from "stream";

export default class YoutubePlugin implements BotPlugin {
  public httpStream(url: string): Promise<Readable> {
    const stream = ytdl(url, {
      filter: "audioonly"
    });

    if (stream) return Promise.resolve(stream);
    else return Promise.reject();
  }
}
