import express from "express";
import got from "got";
import prisma from "../prisma/client";
import { getNewToken } from "../utils/cred";
import client from "../discord/client";
import { UsersToken } from "@prisma/client";
import { MessageEmbed } from "discord.js";
import path from "path";

const app = express();

const updateMessage = async (user: UsersToken): Promise<void> => {
  const discordUser = await client.users.fetch(user.discord_id);

  user.messages_ids.forEach(async (mId) => {
    const message = await discordUser.dmChannel?.messages.fetch(mId);
    const embed = new MessageEmbed()
      .setTitle("authorized successfully")
      .setColor("GREEN");
    message?.edit({
      embeds: [embed],
    });
  });
};

app.get("/sb/auth", async (req, res) => {
  if (!req.query.code || !req.query.state) {
    res.sendFile(path.join(__dirname, "/public/missingParam.html"));
    return;
  }

  const dbUser = await prisma.usersToken
    .findUnique({
      where: { id: req.query.state.toString() },
    })
    .catch(() => null);

  if (!dbUser) {
    res.sendFile(path.join(__dirname, "/public/expiredLink.html"));
    return;
  }

  if (dbUser.resolved) {
    res.sendFile(path.join(__dirname, "/public/authorized.html"));
    return;
  }

  const data = await getNewToken(req.query.code as string);

  if (!data) {
    res.sendFile(path.join(__dirname, "/public/unauthorized.html"));
    return;
  }

  const intraResponse = await got("https://api.intra.42.fr/v2/me", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  }).catch(() => {
    res.sendFile(path.join(__dirname, "/public/unauthorized.html"));
    return null;
  });

  if (intraResponse === null) return;

  const user = await prisma.usersToken.update({
    where: { id: req.query.state?.toString() },
    data: {
      resolved: true,
      refresh_token: data.access_token,
      intra_id: JSON.parse(intraResponse.body).id,
    },
  });
  updateMessage(user);
  res.sendFile(path.join(__dirname, "/public/authorized.html"));
});

export default app;
