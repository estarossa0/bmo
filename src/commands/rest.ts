import { readFileSync } from "fs";
import type { Command } from "../types";

function getRestaurant() {
  const data = JSON.parse(readFileSync("./src/config/cmdConfig.json", "ascii"));
  return data.restaurant;
}

const command: Command = {
  name: "rest",
  description: "tell you restaurant schedule",
  async execute(interaction) {
    const { lunch, dinner } = getRestaurant();
    interaction.reply({
      content: `Lunch: ${lunch.start}h => ${lunch.end}h\
    \nDinner: ${dinner.start}h => ${dinner.end}h`,
      ephemeral: process.env.EPHEMERAL === "true",
    });
  },
};

export default command;
