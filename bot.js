(async () => {
    const env = require('dotenv')
    env.config()
    const canvas = require('discord-canvas')
    const canvaCord = require('canvacord')
    // default imports
    const events = require('events');
    const { exec } = require("child_process")
    const Discord = require("discord.js")
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
    await s4d.client.login(process.env.TOKEN)

    synchronizeSlashCommands(s4d.client, [{
        name: 'ping',
        description: 'Tells you the bot ping',
        options: [

        ]
    },], {
        debug: false,

    })

    s4d.client.on('interactionCreate', async (interaction) => {
        let member = interaction.guild.members.cache.get(interaction.member.user.id)
        if ((interaction.commandName) == 'ping') {
            await interaction.reply({
                content: ('Pong! ' + String(s4d.client.ws.ping)),
                ephemeral: true,
                components: []
            })
        }

    })

    s4d.client.on('messageCreate', async (param1) => {
        // if (param1.content == 'test01') {
        //     s4d.joiningMember = param1;
        //     s4d.client.channels.cache.get('1041049828525887568').send({
        //         content: '** **',
        //         files: [{
        //             attachment: (await new canvas.Welcome().setUsername(((s4d.joiningMember.author).username)).setMemberCount(((s4d.joiningMember.guild).memberCount)).setDiscriminator(((s4d.joiningMember.author).discriminator)).setAvatar(((s4d.joiningMember.author).displayAvatarURL({
        //                 format: "png"
        //             }))).setGuildName(((s4d.joiningMember.guild).name)).setBackground('https://cdn.discordapp.com/attachments/1041108346398314616/1041122336411230258/unknown.png').setColor("title", "#ffffff").setColor("title-border", "#000000").toAttachment()).toBuffer()
        //         }]
        //     })
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
                }))).setGuildName(((s4d.joiningMember.guild).name)).setBackground('https://cdn.discordapp.com/attachments/1041108346398314616/1041122336411230258/unknown.png').setColor("title", "#ffffff").setColor("title-border", "#ffffff").toAttachment()).toBuffer()
            }]
        });
        s4d.joiningMember = null
    });
    return s4d
})();