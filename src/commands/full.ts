import type { Command } from "../types";

const command: Command = {
  name: "full",
  description: "give the cclean tool link",
  async execute(interaction) {
    interaction.reply({
      content: "try this tool => https://github.com/ombhd/Cleaner_42",
      ephemeral: process.env.EPHEMERAL === "true",
    });
  },
};

export default command;
