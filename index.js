const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const handler = require('./models/handler');
//require('dotenv').config();


const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
handler.init();

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      //Routes.applicationGuildCommands(process.env.client_id, process.env.guild_id),
      Routes.applicationCommands(process.env.client_id),
      { body: handler.commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();



const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
] });
client.queue = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus('turbomusic in astrolow');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  let server_queue = client.queue.get(interaction.guildId);
  await handler.replies(interaction, server_queue);
});

client.on('error', (err) => {
  console.log(err.message);
})

client.login(process.env.TOKEN);