import axios from "axios";
import { Readable } from "stream";
import { Adapter } from "./base";

export class Mp3Adapter extends Adapter {
  public isHandleable(): boolean {
    return this.url.endsWith(".mp3");
  }
  public async fetchStream(): Promise<Readable> {
    const res = await axios.get(this.url, { responseType: "stream" });
    return res.data;
  }
}
