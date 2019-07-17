import { Readable } from "stream";

export abstract class Adapter {
  protected url!: string;
  public constructor(url: string) {
    this.url = url;
  }
  abstract isHandleable(): boolean;
  abstract fetchStream(): Promise<Readable>;
}
