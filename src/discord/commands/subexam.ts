import type { Command } from "../../types";
import prisma from "../../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { startInterval } from "../../utils/examInterval";

const command: Command = {
  name: "subexam",
  description: "subscripe to get notified when there is new exam",
  async execute(interaction) {
    let reply = "";

    await prisma.examSubscriber
      .create({
        data: {
          discord_id: interaction.user.id,
        },
      })
      .then(() => {
        reply =
          "Subscribed successfully.\nYou will recieve message when there is new exam";
        startInterval(interaction.client, 3);
      })
      .catch((err: PrismaClientKnownRequestError) => {
        if (err.code === "P2002") {
          reply =
            "You're already subscibed!!\nUse `/examunsub` if you wanna unsubscribe";
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
