import type { Command } from "../../types";
import prisma from "../../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { startInterval } from "../../utils/examInterval";

const command: Command = {
  name: "subexam",
  description: "subscripe to get notified when there is new exam",
  options: [
    {
      name: "campus",
      type: "STRING",
      required: true,
      description: "Your campus",
      choices: [
        { name: "Khouribga", value: "16" },
        { name: "Benguerir", value: "21" },
      ],
    },
  ],
  async execute(interaction) {
    let reply = "";

    await interaction.deferReply({
      ephemeral: process.env.EPHEMERAL === "true",
    });

    const campus = interaction.options.getString("campus", true);
    await prisma.examSubscriber
      .create({
        data: {
          discord_id: interaction.user.id,
          campus: campus,
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
    await interaction.editReply(reply);
  },
};

export default command;
