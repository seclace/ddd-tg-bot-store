import { config } from 'dotenv';
config();

import { TgBotApplication } from './tg-bot-application';

(async () => {
  try {
    const token = process.env.TG_BOT_TOKEN || '';
    const channelId = process.env.TG_CHANNEL_ID || '';
    const bot = new TgBotApplication(token, channelId);
    await bot.initialize();
  } catch (e) {
    console.log('error');
    console.log(e);
    process.exit(1);
  }
})();
