import { GuildMember, MessageEmbed } from "discord.js";
import type { Command } from "../../types";

const command: Command = {
  name: "link",
  description: "give 42 intra link for the USERNAME",
  options: [
    {
      type: "USER",
      name: "username",
      required: true,
      description: "the user you wanna get his 42 intra link",
    },
  ],
  async execute(interaction) {
    const embedReply = new MessageEmbed();
    const userObject = interaction.options.data.find(
      (arg) => arg.name === "username",
    );

    let intraLogin: string | null = null;
    let isUserStudent = false;

    if (userObject?.member && userObject?.member instanceof GuildMember) {
      const roleManager = userObject.member.roles;
      const studentRole = roleManager.cache.find((role) =>
        ["Student-KH", "Student-BG"].includes(role.name),
      );
      if (studentRole) {
        isUserStudent = true;
      }

      const userNickname =
        userObject.member.nickname || userObject.member.user.username;

      if (isUserStudent && userNickname.match(/\[(.*?)\]/)) {
        intraLogin = userNickname.match(/\[(.*?)\]/)?.[1] || null;
      } else if (isUserStudent) {
        intraLogin = userObject.member.displayName;
      }
    }

    if (intraLogin === null || !isUserStudent) {
      interaction.reply({
        content: "The user is not a student",
        ephemeral: process.env.EPHEMERAL === "true",
      });
    } else {
      embedReply
        .setColor("#00babc")
        .setTitle("Intra link")
        .setURL(`https://profile.intra.42.fr/users/${intraLogin}`)
        .setThumbnail(`https://cdn.intra.42.fr/users/medium_${intraLogin}.jpg`);

      await interaction.reply({
        embeds: [embedReply],
        ephemeral: process.env.EPHEMERAL === "true",
      });
    }
  },
};

export default command;
