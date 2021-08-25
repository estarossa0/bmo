import express from "express";
import got from "got";
import prisma from "../prisma/client";
import { getNewToken } from "../utils/cred";

const app = express();

app.get("/auth", async (req, res) => {
  console.log("s");
  if (!req.query.code || !req.query.state) {
    res.send("Missing params");
    return;
  }

  const exist = await prisma.usersToken
    .findUnique({
      where: { id: req.query.state.toString() },
    })
    .then((user) => (user ? true : false))
    .catch(() => false);

  if (!exist) {
    res.send("Link probably expired. Get new link from the bot");
    return;
  }

  const data = await getNewToken(req.query.code as string);

  if (!data) {
    res.send("Autorisation failed");
    return;
  }

  got("https://api.intra.42.fr/v2/me", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  })
    .then(async (intraResponse) => {
      await prisma.usersToken.update({
        where: { id: req.query.state?.toString() },
        data: {
          resolved: true,
          refresh_token: data.access_token,
          intra_id: JSON.parse(intraResponse.body).id,
        },
      });
      res.send("Autorisation successfully, you can close this tab");
    })
    .catch(() => {
      res.send("Autorisation failed");
    });
});
export default app;
