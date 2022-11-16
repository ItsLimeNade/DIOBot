(async () => {
    const env = require('dotenv')
    env.config()
    const canvas = require('discord-canvas')
    const canvaCord = require('canvacord')
    // default imports
    const events = require('events');
    const { exec } = require("child_process")
    const Discord = require("discord.js")
    const Leveling = require('./leveling')
    const {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js")
    const fs = require('fs')
    let process = require('process')
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    // block imports
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands')

    let s4d = {
        Discord,
        fire: null,
        joiningMember: null,
        reply: null,
        player: null,
        manager: null,
        Inviter: null,
        message: null,
        notifer: null
    }

    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION",
            "CHANNEL"
        ]
    })

    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // process.on('uncaughtException', function (err) {
    //     console.log('Error!');
    //     console.log(err);
    // })

    // code

    let leveling = new Leveling(0, 100, 1, 1, 1, 1.2) //Params in order: startingXP: any, neededXP: any, gainedXP: any, xpRate: any, startingLevel: any, levelingRate: any

    await s4d.client.login(process.env.TOKEN)

    synchronizeSlashCommands(s4d.client, [{
        name: 'ping',
        description: 'Tells you the bot ping',
        options: [

        ]
    }, {
        name: 'level',
        description: 'Shows you your current level',
        options: [{
            type: 6,
            name: 'member',
            required: true,
            description: 'see the level of an other user',
            choices: [

            ]
        },]
    }, {
        name: 'leaderboard',
        description: 'Displays the server leaderboard',
        options: [

        ]
    },], {
        debug: false,

    });

    s4d.client.on('interactionCreate', async (interaction) => {
        let member = interaction.guild.members.cache.get(interaction.member.user.id)
        if ((interaction.commandName) == 'ping') {
            await interaction.reply({
                content: ('Pong! ' + String(s4d.client.ws.ping)),
                ephemeral: true,
                components: []
            })
        }
        if ((interaction.commandName) == 'level') {
            slashMember = (interaction.options.getMember('member'));
            await leveling.checkData(slashMember.id, interaction.guild.id)
            const userData = await leveling.getUserData(slashMember.id, interaction.guild.id)
            const rank = new canvaCord.Rank()
                .setAvatar(slashMember.displayAvatarURL({ format: "png" }))
                .setCurrentXP(await userData.currentXP)
                .setRequiredXP(await userData.neededXP)
                .setStatus(slashMember.presence.status)
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(slashMember.user.username)
                .setDiscriminator(slashMember.user.discriminator)
                .setLevel(await userData.currentLevel, 'Level', true)
                .setRank(0, 'Rank', false)

            rank.build()
                .then(async (data) => {
                    const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                    await interaction.reply({ content: 'Here is your level card!', files: [attachment], ephemeral: true })
                });

        }
        if ((interaction.commandName) == 'leaderboard') {
            slashMember = (interaction.options.getMember('member'));
            let leaderboardDB = await leveling.getLeaderboard(5)
            let message = `#1${leaderboardDB[0].userID} level:${leaderboardDB[0].level} xp:${leaderboardDB[0].xp}\n#2${leaderboardDB[1].userID}-${leaderboardDB[1].level}xp:${leaderboardDB[1].xp}\n#3${leaderboardDB[2].userID}-${leaderboardDB[2].level}xp:${leaderboardDB[2].xp}\n#4${leaderboardDB[3].userID}-${leaderboardDB[3].level}xp:${leaderboardDB[3].xp}\n#5${leaderboardDB[4].userID}-${leaderboardDB[4].level}xp:${leaderboardDB[4].xp}`

            await interaction.reply({
                content: message,
                ephemeral: true
            });
        }
    })

    s4d.client.on('messageCreate', async (param1) => {
        await leveling.checkData(param1.author.id, param1.guild.id)
        // if (param1.content == '.test01') {
        //     s4d.joiningMember = param1;
        //     s4d.client.channels.cache.get('1041049828525887568').send({
        //         content: '** **',
        //         files: [{
        //             attachment: (await new canvas.Welcome().setUsername(((s4d.joiningMember.author).username)).setMemberCount(((s4d.joiningMember.guild).memberCount)).setDiscriminator(((s4d.joiningMember.author).discriminator)).setAvatar(((s4d.joiningMember.author).displayAvatarURL({
        //                 format: "png"
        //             }))).setGuildName(((s4d.joiningMember.guild).name)).setBackground('https://cdn.discordapp.com/attachments/1041372494717784186/1042354696171552788/unknown.png').setColor("title", "#ffffff").setColor("title-border", "#000000").setColor("hashtag", "#ffffff").setColor("hashtag", "#ffffff").toAttachment()).toBuffer()
        //         }]
        //     });
        //     s4d.joiningMember = null
        // }
    });

    s4d.client.on('guildMemberAdd', async (param1) => {
        s4d.joiningMember = param1;
        s4d.client.channels.cache.get('1041049828525887568').send({
            content: '** **',
            files: [{
                attachment: (await new canvas.Welcome().setUsername(((s4d.joiningMember.user).username)).setMemberCount(((s4d.joiningMember.guild).memberCount)).setDiscriminator(((s4d.joiningMember.user).discriminator)).setAvatar(((s4d.joiningMember.user).displayAvatarURL({
                    format: "png"
                }))).setGuildName(((s4d.joiningMember.guild).name)).setBackground('https://cdn.discordapp.com/attachments/1041372494717784186/1042354696171552788/unknown.png').setColor("title", "#ffffff").setColor("title-border", "#000000").setColor("hashtag", "#000000").setColor("hashtag", "#000000").toAttachment()).toBuffer()
            }]
        });
        s4d.joiningMember = null
    });
    return s4d
})();