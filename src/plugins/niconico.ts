import axios from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { EventEmitter } from "events";
import { JSDOM } from "jsdom";
import URLParse from "url-parse";
import { ReadStream } from "tty";

import { BotPlugin } from "../client";

export class Niconico {
  public cookieJar: CookieJar;
  public constructor() {
    this.cookieJar = new CookieJar();
    axiosCookieJarSupport(axios);
    axios.defaults.withCredentials = true;
    axios.defaults.jar = this.cookieJar;
  }
  public async login(email: string, password: string): Promise<CookieJar> {
    const loginURL = "https://account.nicovideo.jp/api/v1/login?site=niconico";

    const params = new URLSearchParams();
    params.append("mail_tel", email);
    params.append("password", password);
    await axios.post(loginURL, params);
    return this.cookieJar;
  }
}

export class NicoVideo extends EventEmitter {
  public cookieJar: CookieJar;

  public constructor(cookieJar: CookieJar) {
    super();
    this.cookieJar = cookieJar;
    axiosCookieJarSupport(axios);
    axios.defaults.withCredentials = true;
    axios.defaults.jar = this.cookieJar;
  }

  public async watch(videoID: string): Promise<{ [key: string]: any }> {
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

  public async httpStream(url: string): Promise<ReadStream> {
    const parsed = new URLParse(url);
    const videoId = parsed.pathname.replace("/watch/", "");
    const data = await this.watch(videoId);
    const uri = data.video.smileInfo.url;
    const res = await axios.get(uri, { responseType: "stream" });
    return res.data;
  }
}

export default class NicoPlugin implements BotPlugin {
  public cookieJar!: CookieJar;

  public constructor(email: string, password: string) {
    const niconico = new Niconico();
    niconico
      .login(email, password)
      .then((cookieJar: CookieJar): void => {
        this.cookieJar = cookieJar;
      })
      .catch((error: Error): void => {
        throw error;
      });
  }
  public async httpStream(url: string): Promise<ReadStream> {
    await this.pendLogin();
    const client = new NicoVideo(this.cookieJar);
    return client.httpStream(url);
  }
  private pendLogin(): Promise<void> {
    return new Promise((resolve): void => {
      const intervalId: number = setInterval((): void => {
        if (this.cookieJar) {
          resolve();
          clearInterval(intervalId);
        }
      });
    });
  }
}
