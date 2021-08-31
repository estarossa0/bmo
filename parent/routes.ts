import { exec } from "child_process";
import express from "express";
import proxy from "express-http-proxy";
import pm2 from "pm2";

const app = express();

app.get("/restart", async (req, res) => {
  if (req.query.code !== process.env.PASSWORD) {
    res.send("wrong credentials");
    return;
  }

  pm2.restart("bot", (err) => {
    if (err) res.send("failed to restart");

    console.log("restarted");
  });

  res.send("restarted");
});

app.get("/update", async (req, res) => {
  if (req.query.code !== process.env.PASSWORD) {
    res.send("wrong credentials");
    return;
  }

  exec("git pull", (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(`could not git pull\n${stderr}`);
    }
    res.send(`<!DOCTYPE html>
    <html>
      <body>
        <p>Pulled successfully, restarting in 3 seconds</p>
        <p>${stdout}</p>
      </body>
      <script>
      setTimeout(() => {
        const qs = window.location.search;
        window.location.replace(\`restart\${qs ?? null}\`);
      }, 3000);
      </script>
    </html>`);
  });
});

app.use(proxy(`http://localhost:${process.env.PORT}`));

export default app;
