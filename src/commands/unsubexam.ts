import type { Command } from "../types";
import prisma from "../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { stopInterval } from "../utils/examInterval";

const command: Command = {
  name: "unsubexam",
  description: "unsubscribe from getting notified on new exam event",
  async execute(interaction) {
    let reply = "";

    await prisma.examSubscriber
      .delete({
        where: {
          discord_id: interaction.user.id,
        },
      })
      .then(() => {
        reply =
          "You've unsubscribed successfully.\nYou will no longer recieve message on new exam";

        prisma.examSubscriber.count().then((total) => {
          if (total === 0) stopInterval();
        });
      })
      .catch((err: PrismaClientKnownRequestError) => {
        if (err.code === "P2025") {
          reply =
            "You're not in subsribed list! so you're already unsubscribed";
          return;
        }
        throw new Error(`intern server error ${err.code}`);
      });

    await interaction.reply({
      content: reply,
      ephemeral: process.env.EPHEMERAL === "true",
    });
  },
};

export default command;
