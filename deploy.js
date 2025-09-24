const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const nbx = require("noblox.js");
require("dotenv").config();

async function deploy() {
  const groupId = Number(process.env.GROUPID);
  await nbx.setCookie(process.env.COOKIE);
  const roles = await nbx.getRoles(groupId);

  const rankChoices = roles
    .filter((role) => role.rank <= 32)
    .slice(0, 25)
    .map((role) => ({
      name: role.name.slice(0, 32),
      value: role.rank,
    }));

  const commands = [
    // 🔷 /rutbedegistir
    new SlashCommandBuilder()
      .setName("rutbedegistir")
      .setDescription("Bir kullanıcıya istediğin rütbeyi verir.")
      .addStringOption((option) =>
        option
          .setName("kullanici")
          .setDescription("Roblox kullanıcı adı")
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName("rank")
          .setDescription("Verilecek rütbeyi seç")
          .setRequired(true)
          .addChoices(...rankChoices),
      )
      .addStringOption((option) =>
        option
          .setName("sebep")
          .setDescription("Rütbe değişikliği sebebi")
          .setRequired(true),
      ),

    // 🔷 /promote
    new SlashCommandBuilder()
      .setName("promote")
      .setDescription("Bir kullanıcıyı terfi ettirir.")
      .addStringOption((option) =>
        option
          .setName("kullanici")
          .setDescription("Roblox kullanıcı adı")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option.setName("sebep").setDescription("Sebep").setRequired(false),
      ),

    // 🔷 /demote
    new SlashCommandBuilder()
      .setName("demote")
      .setDescription("Bir kullanıcıyı rütbe düşürür.")
      .addStringOption((option) =>
        option
          .setName("kullanici")
          .setDescription("Roblox kullanıcı adı")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option.setName("sebep").setDescription("Sebep").setRequired(false),
      ),

    // 🔷 /gruplar
    new SlashCommandBuilder()
      .setName("gruplar")
      .setDescription("Bir Roblox kullanıcısının grup üyeliklerini listeler.")
      .addStringOption((option) =>
        option
          .setName("kullanici")
          .setDescription("Roblox kullanıcı adı")
          .setRequired(true),
      ),

    // 🔷 /yardim
    new SlashCommandBuilder()
      .setName("yardim")
      .setDescription("Botun komutları hakkında yardım alırsınız."),

    // 🔷 /tamyasakla
    new SlashCommandBuilder()
      .setName("tamyasakla")
      .setDescription("Kullanıcıyı tüm sunuculardan yasaklar.")
      .addUserOption((option) =>
        option
          .setName("kullanici")
          .setDescription("Yasaklanacak kullanıcı")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option.setName("sebep").setDescription("Sebep").setRequired(false),
      ),

  ].map((cmd) => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("📤 Slash komutlar yükleniyor...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ Slash komutlar başarıyla yüklendi.");
  } catch (error) {
    console.error("❌ Slash komut yükleme hatası:", error);
  }
}

deploy();

