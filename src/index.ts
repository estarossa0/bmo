import { config } from "dotenv";
import { tokenInterval } from "./utils/cred";
import app from "./api/auth.route";
import client from "./discord/client";
import {
  readyHandler,
  interactionCreateHandler,
  messageCreateHandler,
} from "./discord/events";

const alertCrash = async (err: Error | string): Promise<void> => {
  if (process.env.ADMINID) {
    await client.users.fetch(process.env.ADMINID).then(async (admin) => {
      await admin.send(
        `bot going off: ${err instanceof Error ? err.message : err}`,
      );
    });
  }
  if (err === "SIGINT") process.exit(130);
  process.exit(1);
};

async function main() {
  config({ path: "./src/config/.env" });

  await tokenInterval();

  client.once("ready", readyHandler);

  client.on("messageCreate", messageCreateHandler);

  client.on("interactionCreate", interactionCreateHandler);

  client.login(process.env.DISCORD_TOKEN).catch((err) => console.log(err));
  app.listen(process.env.PORT || 8080, () => console.log("api ready"));
}
process.on("uncaughtExceptionMonitor", alertCrash).on("SIGINT", alertCrash);

main();
