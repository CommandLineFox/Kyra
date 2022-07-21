import Command from "../../../command/Command";
import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import type { BotClient } from "../../../BotClient";

export default class Autiomation extends Command {
    public constructor() {
        super("role", "Configuring stored roles", undefined, PermissionFlagsBits.Administrator);
    }

    async execute(interaction: CommandInteraction, client: BotClient): Promise<void> {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const group = interaction.options.getSubcommandGroup() ?? "";
        const subcommand = this.subcommands.get(this.data.name + " " + group + " " + interaction.options.getSubcommand()) ?? this.subcommands.get(this.data.name + " " + interaction.options.getSubcommand());
        if (!subcommand) {
            interaction.reply({ content: "I was unable to find the command.", ephemeral: true });
            return;
        }

        subcommand.execute(interaction, client);
    }
}
