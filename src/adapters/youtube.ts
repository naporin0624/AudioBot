import ytdl from "ytdl-core";
import { Adapter } from "./base";
import { Readable } from "stream";

export class YoutubeAdapter extends Adapter {
  public isHandleable(): boolean {
    return this.url.includes("youtube");
  }
  public fetchStream(): Promise<Readable> {
    const stream = ytdl(this.url, {
      filter: "audioonly"
    });
    return Promise.resolve(stream);
  }
}
