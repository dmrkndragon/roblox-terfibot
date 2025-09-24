require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const nbx = require('noblox.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

// Komutları yükle
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command); // ❗ DÜZELTİLDİ
  } else {
    console.warn(`[UYARI] Komut dosyası '${file}' eksik "data" veya "execute" içermiyor.`);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot hazır: ${client.user.tag}`);

  const activities = [
    { name: 'MosterDev', type: 0 },
    { name: 'Rütbelendirmeleri Botu', type: 1 },
  ];

  let i = 0;
  setInterval(() => {
    const activity = activities[i % activities.length];
    client.user.setPresence({
      activities: [activity],
      status: 'online',
    });
    i++;
  }, 10000);
});

// Roblox giriş
(async () => {
  try {
    await nbx.setCookie(process.env.COOKIE);
    const currentUser = await nbx.getAuthenticatedUser();
    console.log(`🔗 Roblox hesabıyla giriş yapıldı: ${currentUser.UserName}`);
  } catch (error) {
    console.error('❌ Roblox giriş hatası:', error);
  }
})();

// Slash komutları dinle
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`Komut bulunamadı: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('❌ Komut çalıştırılırken hata:', error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'Bir hata oluştu.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
