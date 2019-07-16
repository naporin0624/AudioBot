import Bot from "./client";
import msgActions from "./msgActions";

import config from "./config";
import { niconico, mp3, youtube } from "./plugins";

const plugins = {
  niconico: new niconico(config.niconico.email, config.niconico.password),
  mp3: new mp3(),
  youtube: new youtube()
};

Bot.prototype.plugins = plugins;

const bot = new Bot({ msgActions });
bot.login(config.token);
