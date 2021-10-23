import { exec } from "child_process";
import express from "express";
import proxy from "express-http-proxy";
import pm2 from "pm2";

const app = express();

app.get("/sba/restart", async (req, res) => {
  if (req.query.code !== process.env.PASSWORD) {
    res.status(401).send("unauthorized");
    return;
  }
  pm2.restart("bot", (err) => {
    if (err) {
      res.status(500).send("failed to restart");
      return;
    }
    res.send("restarted");
  });
});

app.get("/sba/update", async (req, res) => {
  if (req.query.code !== process.env.PASSWORD) {
    res.status(401).send("wrong credentials");
    return;
  }
  let restarted = true;

  exec("git pull", (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(`could not git pull\n${stderr}`);
      return;
    }

    pm2.restart("bot", (err) => {
      if (err) restarted = false;
    });

    res.send(`<!DOCTYPE html>
    <html>
      <body>
        <p>${restarted ? "restarted" : "failed to restart"}</p>
        <p>${stdout}</p>
      </body>
    </html>`);
  });
});

app.use(proxy(`http://localhost:${process.env.PORT}`));

export default app;
