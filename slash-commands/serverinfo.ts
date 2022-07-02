import { SlashCommand } from '../classes';

import { MessageEmbed } from 'discord.js';

export default {
	name: 'serverinfo',
	category: 'MISC',
	description: 'Returns JUICY & DELICIOUS info about the server!',

	callback: async ({ interaction, guild, channel }) => {
		const { members, channels, emojis, stickers, roles } = guild;

		const embed = new MessageEmbed()

			.setTitle(guild.name)
			.setAuthor({
				name: guild.name,
				iconURL: guild.iconURL()!
			})
			.setThumbnail(guild.iconURL()!)
			.addFields([
				{
					name: 'GENERAL',
					value: [
						`Name: ${guild.name}`,
						`Created: <t:${(guild.createdTimestamp / 1000).toFixed(
							0
						)}:R>`,
						`Roles: ${
							roles.cache
								.map((r) => r)
								.join(' ')
								.replace('@everyone', ' ') || 'None'
						}`,
						`Total Roles: ${roles.cache.size}`,
						`Owner: <@${guild.ownerId}>`,
						`Description: ${
							guild.description
								? !guild.description
								: 'No Description'
						}`
					].join('\n')
				},
				{
					name: '💡 | USERS',
					value: [
						`- Members: ${
							members.cache.filter((member) => !member.user.bot)
								.size
						}`,
						`- Bots: ${
							members.cache.filter((member) => member.user.bot)
								.size
						}`,
						`- Total: ${guild.memberCount}`
					].join('\n')
				},
				{
					name: '📔 | CHANNELS',
					value: [
						`- Text: ${
							channels.cache.filter(
								(channel) => channel.type === 'GUILD_TEXT'
							).size
						}`,
						`- Voice: ${
							channels.cache.filter(
								(channel) => channel.type === 'GUILD_VOICE'
							).size
						}`,
						`- Threads: ${
							channels.cache.filter(
								(channel) =>
									channel.type in
									[
										'GUILD_PUBLIC_THREAD',
										'GUILD_PRIVATE_THREAD',
										'GUILD_NEWS_THREAD'
									]
							).size
						}`,
						`- Categories: ${
							channels.cache.filter(
								(channel) => channel.type === 'GUILD_CATEGORY'
							).size
						}`,
						`- Stages: ${
							channels.cache.filter(
								(channel) =>
									channel.type === 'GUILD_STAGE_VOICE'
							).size
						}`,
						`- News: ${
							channels.cache.filter(
								(channel) => channel.type === 'GUILD_NEWS'
							).size
						}`,
						`- Total: ${
							channels.cache.filter(
								(channel) => channel.type !== 'GUILD_CATEGORY'
							).size
						}`
					].join('\n')
				},
				{
					name: '😃 | EMOJIS',
					value: [
						`- Animated: ${
							emojis.cache.filter((emoji) => emoji.animated!).size
						}`,
						`- Static: ${
							emojis.cache.filter((emoji) => !emoji.animated).size
						}`,
						`- Stickers: ${stickers.cache.size}`,
						`- Total: ${emojis.cache.size + stickers.cache.size}`
					].join('\n')
				},
				{
					name: 'NITRO STATISTICS',
					value: [
						`- Tier: ${guild.premiumTier.replace('TIER_', '')}`,
						`- Boosts: ${guild.premiumSubscriptionCount}`,
						`- Boosters: ${
							members.cache.filter((member): boolean => {
								if (!member.premiumSince) {
									return false;
								} else {
									return true;
								}
							}).size
						}`
					].join('\n')
				}
			])
			.setFooter({
				text: 'Last Checked'
			})
			.setTimestamp()
			.setColor('PURPLE');

		await channel.sendTyping();
		await interaction.reply({ embeds: [embed] });
	}
} as SlashCommand;
