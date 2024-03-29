//Techy504#2069
const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const { DiscordTogether } = require('discord-together');
require('dotenv').config();
// const Mongoose = require('mongoose')
const client = new Discord.Client();
client.commands = new Discord.Collection();
const talkedRecently = new Set();
// const dbURI = `mongodb+srv://${process.env.DBID}:${process.env.DBPASS}@cluster0.uab70.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const invites = {};
const wait = require('util').promisify(setTimeout);

const { prefix, cooldownTime, exceptionRole } = config; //Exception role = use bot without cool downs

const token = process.env.TOKEN;
client.login(token);
console.log(prefix + ' go go!');

const commandFiles = fs.readdirSync('./commands').filter((file) => {
    file.endsWith('.js');
    const command = require(`./commands/${file}`);
    client.commands.set(command.cmdname, command);
});
//Load up [cmds].js


client.discordTogether = new DiscordTogether(client); //NPM module : discord-together

client.on('ready', () => {
    console.log('Ready to begin! with prefix: ' + prefix);

    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });

    if (config.botActivity) {
        botAliveInterval = setInterval(() => keepBotAlive(client), 1000 * 60 * 20) //20mins
    }
    //This is for hosting bot in heroku , it sends out a message to a specific channel at certain interval and stops from being turned off
    //If you are going to host this bot somewhere , you can remove this code
});


// @parm {Discord.Message} message
client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.guild == null) return;

    let hasUsedCmdrecently = talkedRecently.has(message.author.id)
    let hasExceptionRole = await message.member.roles.cache.find(role => role.name == exceptionRole)
    if (hasUsedCmdrecently && !hasExceptionRole) return await message.reply(`Wait ${cooldownTime} seconds before , using commands again. - ${message.author}`)

    if (!hasUsedCmdrecently || hasExceptionRole) {
        addToTalkedRecently(message.author.id, cooldownTime)
        const args = message.content.slice(prefix.length).trim().toLowerCase().split(/ +/);
        const primaryCommand = args.shift().toLowerCase();

        if (!client.commands.has(primaryCommand)) return; //Exit immediatedly if the message doesn't have a valid command
        //Run respective command's function
        try {
            obj = {
                msgEmbed: new Discord.MessageEmbed(),
                prefix: prefix,
                client: client,
                config: config
            }
            console.log('command_executing.. : ' + primaryCommand);
            client.commands.get(primaryCommand).exec(message, args, obj); //Sending a obj instead , will be easier if you want sub-file to access unique information
        } catch (error) {
            console.error(error);
            await message.reply('cmd file not found : ' + primaryCommand + ' please contact developer or admin');
        }
    }
});

function keepBotAlive(client) {
    client.channels.cache.get(config.botActivityChannel).send(new Discord.MessageEmbed().setColor('#0099ff').setTitle(`$T@Y!N @l!VE`).setTimestamp())
} //Kepping the bot alive from going down

function addToTalkedRecently(ID, cooldownTime) {
    talkedRecently.add(ID)
    setTimeout(_ => talkedRecently.delete(ID), parseInt(cooldownTime) * 1000)
}


client.on('guildMemberAdd', member => {
    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites; //save up the new invites
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        const inviter = client.users.cache.get(invite.inviter.id);
        const logChannel = member.guild.channels.cache.find(channel => channel.name === "general");
        let userInventoryFile = JSON.parse(fs.readFileSync(config.invdir + inviter.id))//.invites
        userInventoryFile.invites += invite.uses - ei.get(invite.code).uses
        fs.writeFileSync(config.invdir + inviter.id , JSON.stringify(userInventoryFile,null,2))
        logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation. And ${inviter.author} now has ${userInventoryFile}`);
    });
});

//add prevention for duplicated people 
//add time waiting
//eof // // // // // /// /// /// /// /// / /// /// /// / /// / // / // /made my techy504#2069 and Syrena