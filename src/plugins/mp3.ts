import { BotPlugin } from "../client";
import { ReadStream } from "tty";

import axios from "axios";

export default class Mp3Plugin implements BotPlugin {
  public async httpStream(url: string): Promise<ReadStream> {
    const res = await axios.get(url, { responseType: "stream" });
    return res.data;
  }
}
