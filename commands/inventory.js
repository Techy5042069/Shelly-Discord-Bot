const fs = require('fs');
const embedImage = 'https://media.discordapp.net/attachments/862943946924621825/864148596639531048/standard_6.gif?width=230&height=230'

module.exports = {
    cmdname: 'inv',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    }
};

async function getfunc(msg, args, obj) {
    let returnedArray = await getTragetUser(msg, args, obj)
    roleMention = returnedArray[0]
    userFileLocation = obj.config.invdir + returnedArray[1]

    const probabilityFile = await JSON.parse(fs.readFileSync(obj.config.probfile)) //probability json file, 
    crateName = Object.keys(probabilityFile) //using probability file because it has all the crate/box info
    if (msg.member.hasPermission('ADMINISTRATOR')) args[0] = 'full' //enable full inventory preview if the user is an admin
    if (fs.existsSync(userFileLocation)) {
        msgEmbed = await getDefaultMsg(userFileLocation, obj.msgEmbed, roleMention, msg, args, crateName)
        msg.channel.send(msgEmbed)
    } else {
        createUserFile(userFileLocation, crateName, obj, msg);
    }
    return console.log("processed!")
}

function getUserFromMention(mention, msg) {
    if (!mention || mention.length != 18 || !Number.isInteger(mention)) return msg.author.id;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention;
    } else if (mention.length = 18) { //18 is the length of snowflake
        return mention
    }
}

async function getTragetUser(msg, args) {
    if (msg.member.hasPermission('ADMINISTRATOR') && args[0]) {
        roleMention = await getUserFromMention(args[0], msg);
        nameOfFile = `${roleMention}.json`;
    } else {
        roleMention = msg.author.id
        nameOfFile = `${msg.author.id}.json`
    }
    // console.log(roleMention, nameOfFile)
    return [roleMention, nameOfFile] //Check config.json for invdir
}

async function getDefaultMsg(userFileLocation, msgEmbed, roleMention, msg, args, crateName, ) {
    let workingFile = await JSON.parse(fs.readFileSync(userFileLocation));
    msgEmbed
        .setColor('#0099ff')
        .setThumbnail(embedImage)
        .setTitle('INVENTORY=>')
        .setDescription(`<@${roleMention}> you have these in your inventory:`)
        .setTimestamp()
        .setFooter(`chicken Rewards #0.1k , invite people to get keys, Details requested by: ${msg.author.username}`, 'https://cdn.discordapp.com/emojis/859444593421320212.gif?v=1'); //arrow

    for (let i = 0; i < crateName.length; i++) {
        msgEmbed.addFields({
            name: `**${crateName[i]} Keys**`,
            value: workingFile[crateName[i]],
            inline: true
        })
    }

    msgEmbed.addFields({
        name: `**Invites:**`,
        value: workingFile.invites,
        inline: false
    })

    if (args[0] == 'full') { //[prefix]inv full
        for (let i = 0; i < crateName.length; i++) {
            msgEmbed.addFields({
                name: `**Total ${crateName[i]} Keys:**`,
                value: workingFile['x' + crateName[i]],
                inline: true
            })
        }
        msgEmbed.addFields({
            name: `**total Invites:**`,
            value: workingFile.xinvites,
            inline: false
        })

    }
    return msgEmbed;
}

async function createUserFile(userFileLocation, crateName, obj, msg) {
    let data = JSON.stringify(createUserData(crateName, obj), null, 2)
    fs.writeFile(
        userFileLocation,
        data,
        async function(err) {
            if (err) {
                console.log('error making a file!');
                console.log(err.message);
                return;
            }
            await msg.reply(` File succesfuly created! , please run the command again!`);
            return;
        }
    );
}

function createUserData(crateName, obj) {
    let data = {}
    // console.log(crateName)
    for (let i = 0; i < crateName.length; i++) {
        data[crateName[i]] = 10
        if (obj.config.enableUserMetaData) data['x' + crateName[i]] = 10 //every key inside a box/crate name that starts with 'x' is the meta data , i.e. the total amount of the respective box that the person had
    }
    //after the for loop you could add custom key:values too
    data.invites = 0
    data.xinvites = 0
    return data
}