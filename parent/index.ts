import app from "./routes";
import pm2 from "pm2";
import { config } from "dotenv";

config({ path: "./src/config/.env" });

pm2.connect((err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

pm2.start(
  {
    script: "npm",
    name: "bot",
    args: ["run", "bot"],
  },
  (err) => {
    if (err) {
      console.error(err);
      return pm2.disconnect();
    }
    console.log("started");
  },
);

process.on("SIGINT", () => {
  pm2.delete("bot", (err) => {
    if (err) console.log(err);
    console.log("deleted");
    process.exit(0);
  });
});

app.listen(80, () => console.log("listening"));
