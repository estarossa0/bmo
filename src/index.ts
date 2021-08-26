import { config } from "dotenv";
import { getNewToken } from "./utils/cred";
import app from "./api/auth.route";
import client from "./discord/client";
import {
  readyHandler,
  interactionCreateHandler,
  messageCreateHandler,
} from "./discord/events";

async function main() {
  config({ path: "./src/config/.env" });

  process.env.INTRA_TOKEN = (await getNewToken())?.access_token;

  client.once("ready", readyHandler);

  client.on("messageCreate", messageCreateHandler);

  client.on("interactionCreate", interactionCreateHandler);

  client.login(process.env.DISCORD_TOKEN).catch((err) => console.log(err));
  app.listen(process.env.PORT || 80, () => console.log("api ready"));
}

main().catch((err) => console.log(err));
