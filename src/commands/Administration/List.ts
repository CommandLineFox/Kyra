import Command from "../../command/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";
import type { BotClient } from "../../BotClient";
import type { Guild } from "../../models/Guild";

export default class Autiomation extends Command {
    public constructor() {
        super("list", "List all settings for current guild", [], ["ADMINISTRATOR"]);
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

        const embed = new MessageEmbed()
            .setTitle("The current settings for this server:")
            .addField("Member role", await displayData(interaction, client, guild, "member"), true)
            .addField("Unverified role", await displayData(interaction, client, guild, "unverified"), true)
            .addField("Welcome channel", await displayData(interaction, client, guild, "welcomechannel"), true)
            .addField("Welcome message", await displayData(interaction, client, guild, "welcomemessage"), true)
            .addField("Welcome notification", await displayData(interaction, client, guild, "welcomenotification"), true)
            .addField("Auto-add unverified", await displayData(interaction, client, guild, "autoaddunverified"), true)
        interaction.reply({ embeds: [embed] });
    }
}

async function displayData(interaction: CommandInteraction, client: BotClient, guild: Guild, type: string): Promise<any> {
    const database = client.database;
    switch (type.toLowerCase()) {
        case "member": {
            if (!guild.config.roles) {
                return "Not set up";
            }

            const id = guild.config.roles.member;
            if (!id) {
                return "No mute role";
            }

            const role = interaction.guild!.roles.cache.get(id);
            if (!role) {
                await database.guilds.updateOne({ id: guild.id }, { "$unset": { "config.roles.member": "" } });
                return "No member role";
            }

            return role.name;
        }

        case "unverified": {
            if (!guild.config.roles) {
                return "Not set up";
            }

            const id = guild.config.roles.unverified;
            if (!id) {
                return "No unverified role";
            }

            const role = interaction.guild!.roles.cache.get(id);
            if (!role) {
                await database.guilds.updateOne({ id: guild.id }, { "$unset": { "config.roles.unverified": "" } });
                return "No unverified role";
            }

            return role.name;
        }

        case "welcomechannel": {
            if (!guild.config.welcome?.channel) {
                await database.guilds.updateOne({ id: guild.id }, { "$unset": { "config.welcome.channel": "" } });
                return "None";
            }

            return `${interaction.guild!.channels.cache.get(guild.config.welcome.channel)}`;
        }

        case "welcomemessage": {
            if (!guild.config.welcome?.message) {
                return "None";
            }

            return guild.config.welcome.message;
        }

        case "welcomenotification": {
            return guild.config.welcome?.notification === true ? "Enabled" : "Disabled";
        }

        case "autoremovensfw": {
            return guild.config.autoRemoveNsfw === true ? "Enabled" : "Disabled";
        }

        case "autoaddunverified": {
            return guild.config.autoAddUnverified === true ? "Enabled" : "Disabled";
        }
    }
}
