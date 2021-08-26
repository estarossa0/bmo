import type { Command } from "../../types";
import got from "got";
import { MessageEmbed } from "discord.js";

const command: Command = {
  name: "exam",
  description: "Check if there is an exam currently",
  async execute(interaction) {
    got<Array<any>>("https://api.intra.42.fr/v2/campus/16/cursus/21/exams", {
      headers: {
        Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
      },
      throwHttpErrors: false,
      resolveBodyOnly: true,
      responseType: "json",
    })
      .then((response) => {
        const examEndTime = new Date(response[0].end_at);
        const now = Date.now();
        if (examEndTime.getTime() < now) {
          interaction.reply({
            content: `**NO** there is no exam currently. Last exam was ${examEndTime.toDateString()}`,
            ephemeral: process.env.EPHEMERAL === "true",
          });
        } else {
          const date = new Date(response[0].begin_at);
          const embed = new MessageEmbed();

          embed
            .setTitle("current exam:")
            .setColor("#FF6950")
            .setDescription(response[0].name)
            .addFields(
              {
                name: "date",
                value: date.toDateString(),
              },
              {
                name: "Total places",
                value: response[0].max_people.toString(),
              },
              {
                name: "location",
                value: response[0].location,
              },
            );

          interaction.reply({
            embeds: [embed],
            ephemeral: process.env.EPHEMERAL === "true",
          });
        }
      })
      .catch((err) => console.log(err));
  },
};

export default command;
