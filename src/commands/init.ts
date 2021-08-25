import { UsersToken } from "@prisma/client";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { URL } from "url";
import prisma from "../prisma/client";
import type { Command } from "../types";

function createAuthLink(user: UsersToken): string {
  const link = new URL("https://api.intra.42.fr/oauth/authorize");

  link.searchParams.append("client_id", process.env.INTRA_UID || "noUID");
  link.searchParams.append(
    "redirect_uri",
    process.env.INTRA_REDIRECT || "nouri",
  );
  link.searchParams.append("response_type", "code");
  link.searchParams.append("state", user.id);
  link.searchParams.append("scope", "public projects");

  return link.toString();
}

const checkIfExist = async (
  interaction: CommandInteraction,
): Promise<boolean> => {
  const foundUser = await prisma.usersToken.findUnique({
    where: { discord_id: interaction.user.id },
  });

  if (foundUser === null) return false;

  const embed = new MessageEmbed();

  embed.setURL(createAuthLink(foundUser));
  embed.setTitle("Authorization link");

  const reply = foundUser.resolved
    ? "Your account is already linked"
    : "I will reply in a Direct Message.";

  interaction.editReply(reply);

  if (foundUser.resolved) return true;

  const messageUser = await interaction.client.users.fetch(interaction.user.id);

  const newMessage = await messageUser.send({
    content: "Use the link I gave you a minute ago. If you lost it, here:\n",
    embeds: [embed],
  });

  await prisma.usersToken.update({
    where: { id: foundUser.id },
    data: { messages_ids: { push: newMessage.id } },
  });

  return true;
};

async function deleteInit(user: UsersToken, client: Client) {
  const authUser = await prisma.usersToken.findUnique({
    where: { id: user.id },
  });

  if (authUser && !authUser.resolved) {
    const deletedUser = await prisma.usersToken.delete({
      where: { id: user.id },
    });

    const discordUser = await client.users.fetch(deletedUser.discord_id);

    deletedUser.messages_ids.forEach(async (mId) => {
      const message = await discordUser.dmChannel?.messages.fetch(mId);

      message?.edit({
        embeds: [new MessageEmbed().setTitle("Link expired :timer:")],
      });
    });
  }
}

const command: Command = {
  name: "init",
  description: "Link you intra account with you discord user",
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: process.env.EPHEMERAL === "true",
    });
    const exist = await checkIfExist(interaction);
    if (exist) return;

    const embed = new MessageEmbed();

    const user = await prisma.usersToken.create({
      data: { discord_id: interaction.user.id },
    });
    setTimeout(deleteInit, 1000 * 60 * 5, user, interaction.client);
    embed.setURL(createAuthLink(user));
    embed.setTitle("Authorization link");

    interaction.editReply("I will reply in a Direct Message.");

    const messageUser = await interaction.client.users.fetch(
      interaction.user.id,
    );

    const message = await messageUser.send({
      content:
        "This command will link your intra with discord bot, so you can use /logtime command\n" +
        "please use this link to autorize.\nPS: it expire in 5 minutes",
      embeds: [embed],
    });

    await prisma.usersToken.update({
      where: { id: user.id },
      data: { messages_ids: { push: message.id } },
    });
  },
};

export default command;
