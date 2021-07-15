//Syrena and Techy504#2069
const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const talkedRecently = new Set();
const { DiscordTogether } = require('discord-together');

//
//
const token = process.env.token;
const { prefix, cooldown, exceptionRole, probfile } = config;
//exception role = use bot without cool downs
console.log(prefix + ' go go!');
client.login(token);
const commandFiles = fs.readdirSync('./commands').filter((file) => {
    file.endsWith('.js');
    const command = require(`./commands/${file}`);
    client.commands.set(command.cmdname, command);
});
//load up [cmds].js
//
//
//check ready

client.discordTogether = new DiscordTogether(client);

client.on('ready', () => {
    console.log('Ready to begin! with prefix: ' + prefix);
    let botAliveInterval = setInterval(keepBotAlive(client),1000*60*20) //20mins
});
// client.wa.ping
//read the msg and determine wethere to send msg or not...
client.on('message', (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return; //immediately exit checking if the message doesn't start with prefix and the usesr is bot
    if (talkedRecently.has(msg.author.id) && !msg.member.roles.cache.find(role => role.name === exceptionRole)) {
        msg.channel.send(`Wait ${cooldown} seconds before , using commands again. - ${msg.author}`);
    } else {
        // Adds the user to the set so that they can't talk for 'cooldown' time
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(msg.author.id);
        }, parseInt(cooldown) * 1000); //currently 25s

        const args = msg.content
            .slice(prefix.length)
            .trim()
            .toLowerCase()
            .split(/ +/); //stores message (prefix removed) , in an array separated by " "

        const command = args.shift().toLowerCase(); // varriable for main command
        // let ping = client.ws.ping;
        if (!client.commands.has(command)) return; //exit immediatedly if the message doesn't have a valid command
        //run respective command's function.ms
        try {
            console.log('command_executing.. : ' + command);
            client.commands.get(command).exec(msg, args, new Discord.MessageEmbed(), prefix, {
                client: client,
                probFileLocation: probfile
            });
        } catch (error) {
            console.error(error);
            msg.reply('cmd file not found : ' + command + ' please contact developer or admin');
        }
    }
});
function keepBotAlive(client) {
    client.channels.cache.get('865083859523993610').send(new Discord.MessageEmbed().setColor('#0099ff').setTitle(`keeping myself alive!`).setTimestamp())
}
//eof // // // // // /// /// /// /// /// / /// /// /// / /// / // / // /made my techy504#2069 and Syrena
