import type { Command } from "../../types";

const command: Command = {
  name: "ping",
  description: "Replies with server ping",
  async execute(interaction) {
    await interaction.reply({
      content: `${interaction.createdTimestamp - Date.now()} ms`,
      ephemeral: process.env.EPHEMERAL === "true",
    });
  },
};

export default command;
