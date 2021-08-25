import { CommandInteraction, ApplicationCommandData } from "discord.js";

type CommadOptions = {
  type: string;
  name: string;
  required: boolean;
  description: string;
};

export type Command = {
  execute: (interface: CommandInteraction) => Promise<void>;
} & ApplicationCommandData;
