import axios from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { JSDOM } from "jsdom";
import URLParse from "url-parse";
import { Adapter } from "./base";
import { Readable } from "stream";

export class NiconicoAdapter extends Adapter {
  public constructor(url: string) {
    super(url);
    axiosCookieJarSupport(axios);
    axios.defaults.withCredentials = true;
    axios.defaults.jar = new CookieJar();
  }
  public isHandleable(): boolean {
    return this.url.includes("nicovideo");
  }
  public async fetchStream(): Promise<Readable> {
    const parsed = new URLParse(this.url);
    const videoId = parsed.pathname.replace("/watch/", "");
    const data = await this.watch(videoId);
    const uri = data.video.smileInfo.url;
    const res = await axios.get(uri, { responseType: "stream" });
    return res.data;
  }
  private async watch(videoID: string): Promise<{ [key: string]: any }> {
    const res = await axios.get(`https://www.nicovideo.jp/watch/${videoID}`);
    const body = res.data;
    const { document } = new JSDOM(body).window;
    const el = document.querySelector("#js-initial-watch-data");
    if (el) {
      const api = el.getAttribute("data-api-data");
      if (api) return JSON.parse(api);
      else throw "data-api-data is not found";
    } else throw "data-api-data is not found";
  }
}
