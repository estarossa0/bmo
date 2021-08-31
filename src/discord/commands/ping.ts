import type { Command } from "../../types";

const command: Command = {
  name: "ping",
  description: "Replies with server ping",
  async execute(interaction) {
    await interaction.reply({
      content: `${Date.now() - interaction.createdTimestamp} ms`,
      ephemeral: process.env.EPHEMERAL === "true",
    });
  },
};

export default command;
