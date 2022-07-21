import Command from "../../command/Command";
import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import type { BotClient } from "../../BotClient";

export default class Autiomation extends Command {
    public constructor() {
        super("approve", "Approve a user into the server", undefined, PermissionFlagsBits.ManageRoles);

        this.data.addUserOption(option =>
            option.setName("user")
                .setDescription("The user to approve")
                .setRequired(true)
        )
    }

    async execute(interaction: CommandInteraction, client: BotClient): Promise<void> {
        if (!interaction.guild) {
            return;
        }

        const guild = await client.database.getGuild(interaction.guild.id);
        if (!guild) {
            interaction.reply({ content: "There was an error while trying to reach the database.", ephemeral: true });
            return;
        }

        if (!guild.config.roles?.member) {
            interaction.reply({ content: "The member role hasn't been set up, you cannot approve users.", ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.options.getUser("user", true));

        if (member.roles.cache.has(guild.config.roles.member)) {
            interaction.reply({ content: "You cannot approve someone who is already verified.", ephemeral: true });
            return;
        }

        if (guild.config.roles?.unverified && member.roles.cache.has(guild.config.roles.unverified)) {
            await member.roles.remove(guild.config.roles.unverified);
        }

        member.roles.add(guild.config.roles.member);
        interaction.reply(`Successfully verified **${member.user.tag}**.`);
    }
}