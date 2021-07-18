//Techy504#2069
const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const { DiscordTogether } = require('discord-together');
require('dotenv').config();
const client = new Discord.Client();
client.commands = new Discord.Collection();
const talkedRecently = new Set();


const { prefix, cooldown, exceptionRole } = config; //exception role = use bot without cool downs


const token = process.env.TOKEN;
client.login(token);
console.log(prefix + ' go go!');


const commandFiles = fs.readdirSync('./commands').filter((file) => {
    file.endsWith('.js');
    const command = require(`./commands/${file}`);
    client.commands.set(command.cmdname, command);
});
//load up [cmds].js



client.discordTogether = new DiscordTogether(client); //npm module : discord-together


client.on('ready', () => {
    console.log('Ready to begin! with prefix: ' + prefix);
    let botAliveInterval = setInterval(() => keepBotAlive(client), 1000 * 60 * 20)
    //this is for hosting bot in heroku , it sends out a msg to a specific channel at certain interval and stops from being turned off
    //if you are going to host this bot somewhere , you can remove this code
});


client.on('message', (msg) => {

    if (!msg.content.startsWith(prefix) || msg.author.bot || msg.guild == null) return;
    //immediately exit checking if the message doesn't start with prefix and the usesr is bot

    if (talkedRecently.has(msg.author.id) && !msg.member.roles.cache.find(role => role.name === exceptionRole)) {
        msg.channel.send(`Wait ${cooldown} seconds before , using commands again. - ${msg.author}`);
    } else {
        // Adds the user to the set so that they can't talk for 'cooldown' time
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(msg.author.id);
        }, parseInt(cooldown) * 1000); //currently 25s


        const args = msg.content.slice(prefix.length).trim().toLowerCase().split(/ +/); //stores message (prefix removed) , in an array separated by " "

 
        const command = args.shift().toLowerCase(); // varriable for main command
        if (!client.commands.has(command)) return; //exit immediatedly if the message doesn't have a valid command
 

        //run respective command's function
        try {
            console.log('command_executing.. : ' + command);
            client.commands.get(command).exec(msg, args, {
                msgEmbed: new Discord.MessageEmbed(),
                prefix: prefix,
                client: client,
                config: config
            }); //sending a obj instead , will be easier if you want sub-file to access unique information
        } catch (error) {
            console.error(error);
            msg.reply('cmd file not found : ' + command + ' please contact developer or admin');
        }
    }
});

function keepBotAlive(client) {
    client.channels.cache.get('865083859523993610').send(new Discord.MessageEmbed().setColor('#0099ff').setTitle(`$T@Y!N @l!VE`).setTimestamp())
} //kepping the bot alive from going down
//eof // // // // // /// /// /// /// /// / /// /// /// / /// / // / // /made my techy504#2069 and Syrena
