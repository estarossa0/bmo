import { MessageEmbed } from "discord.js";
import type { Command } from "../../types";
import got from "got";

const command: Command = {
  name: "link",
  description: "give 42 intra link for the USERNAME",
  options: [
    {
      type: "STRING",
      name: "username",
      required: true,
      description: "the user you wanna get his 42 intra link",
    },
  ],
  async execute(interaction) {
    const embedReply = new MessageEmbed();
    const userName = interaction.options.data.find(
      (arg) => arg.name === "username",
    )?.value;

    const userData = await got(`https://api.intra.42.fr/v2/users/${userName}`, {
      headers: {
        Authorization: `Bearer ${process.env.INTRA_TOKEN}`,
      },
      throwHttpErrors: false,
    }).then(async (response) => {
      if (response.statusCode != 200) {
        if (response.statusCode === 404) return null;

        throw new Error();
      }
      return JSON.parse(response.body);
    });

    if (userData === null) {
      interaction.reply({
        content: "Username not found",
        ephemeral: process.env.EPHEMERAL === "true",
      });
    }
    embedReply
      .setColor("#00babc")
      .setTitle(
        typeof userData.displayname === "string"
          ? userData.displayname
          : "Title",
      )
      .setURL(`https://profile.intra.42.fr/users/${userName}`)
      .setThumbnail(userData.image_url)
      .addFields(
        {
          name: "Campus",
          value: userData.campus.find((campus: any) => campus.active === true)
            .name,
          inline: true,
        },
        {
          name: "Level",
          value: userData.cursus_users
            .find((cursus: any) => cursus.end_at === null)
            .level.toString(),
          inline: true,
        },
      );

    await interaction.reply({
      embeds: [embedReply],
      ephemeral: process.env.EPHEMERAL === "true",
    });
  },
};

export default command;
