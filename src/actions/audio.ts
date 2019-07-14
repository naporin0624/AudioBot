import Bot, {
  Message,
  BotPlugin,
  StreamDispatcher,
  VoiceConnection
} from "../client";
import URLParse from "url-parse";
import { ReadStream } from "tty";
import axios, { AxiosResponse } from "axios";
import { Readable } from "stream";

export default class Audio extends Bot {
  public streamList: Promise<ReadStream | Readable>[] = [];
  private dispatcher?: StreamDispatcher;

  public async play(message: Message): Promise<void> {
    if (message.content === "") {
      message.reply("urlも書いて！");
      return;
    }
    if (!(await this.isURL(message.content))) {
      message.reply("接続できるURL書いて");
      return;
    }

    this.createStream(message.content);
    if (this.dispatcher) {
      console.log(`status: speaking\nmessage: ${message.content}`);
      return;
    }

    const conn = await this.createConnection(message);
    conn && this.playAudio(conn);
  }
  public stop(message: Message): void {
    this.streamList = [];
    if (this.dispatcher) {
      this.dispatcher.end();
      this.dispatcher = undefined;
    } else message.reply("今再生してないよ");
  }
  public next(message: Message): void {
    if (this.dispatcher) {
      this.dispatcher.end();
      this.dispatcher = undefined;
    } else message.reply("次ないよ");
  }
  public pause(message: Message): void {
    if (this.dispatcher) this.dispatcher.pause();
    else message.reply("今再生してないよ");
  }
  public resume(message: Message): void {
    if (this.dispatcher) this.dispatcher.resume();
    else message.reply("今なんもしてないよ");
  }

  private async isURL(url: string): Promise<boolean> {
    const res = await axios.get(url).catch(
      (res: AxiosResponse): AxiosResponse => {
        res.status = 404;
        return res;
      }
    );
    if (res.status === 200) return Promise.resolve(true);
    else return Promise.resolve(false);
  }

  private async playAudio(conn: VoiceConnection): Promise<void> {
    if (this.streamList.length < 1) return;
    console.log(this.streamList.length);
    const stream = await this.streamList.shift();
    this.dispatcher = stream && conn.playStream(stream);
    this.dispatcher &&
      this.dispatcher.on("end", (): void => {
        this.dispatcher = undefined;
        this.playAudio(conn);
      });
  }
  private async createConnection(
    message: Message
  ): Promise<VoiceConnection | undefined> {
    if (!message.guild) return undefined;
    else if (message.member.voiceChannel) {
      return await message.member.voiceChannel.join();
    } else {
      message.reply("ルームに入ると良さそう");
      return undefined;
    }
  }
  private async createStream(url: string): Promise<void> {
    const plugin = this.switchPlugin(url);
    const stream = plugin && plugin.httpStream(url);
    stream && this.streamList.push(stream);
  }
  private switchPlugin(url: string): BotPlugin | undefined {
    const parser = new URLParse(url);
    if (parser.host.includes("nicovideo")) return this.plugins.niconico;
    else if (parser.host.includes("youtube")) return this.plugins.youtube;
    else if (parser.href.endsWith(".mp3")) return this.plugins.mp3;
  }
}
