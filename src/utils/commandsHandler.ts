import { readdirSync } from "fs";
import { Command } from "../types";

async function getCommands(): Promise<Command[]> {
  const promisesArray: Promise<Command>[] = [];

  const commandFiles = readdirSync("./src/discord/commands").filter((file) =>
    file.endsWith(".ts"),
  );

  for (const file of commandFiles) {
    promisesArray.push(
      import(`../discord/commands/${file}`.replace(".ts", "")).then(
        (command) => (command = command.default),
      ),
    );
  }
  return Promise.all(promisesArray);
}

export default getCommands;
