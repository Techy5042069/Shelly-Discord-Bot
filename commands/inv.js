const fs = require('fs');
module.exports = {
    cmdname: 'inv',
    exec(msg, args, msgEmbed, ping, obj) {
        // msg.mentions.

        return getfunc(msg, args, msgEmbed, obj);
    }
};

function getfunc(msg, args, msgEmbed, obj) {
    if (msg.member.hasPermission('ADMINISTRATOR') && args[0]) {
        user = getUserFromMention(args[0], msg);
        nameOfFile = `${user}.json`;
        roleMention = user
    } else {
        nameOfFile = `${msg.author.id}.json`
        roleMention = msg.author.id
    }
    let probFileObj = JSON.parse(fs.readFileSync(obj.probFileLocation))
    if (fs.existsSync('./data/invs/' + nameOfFile)) {
        let workingFile = JSON.parse(
            fs.readFileSync('./data/invs/' + nameOfFile)
        );
        let chicken = 'https://media.discordapp.net/attachments/862943946924621825/864148596639531048/standard_6.gif?width=230&height=230'

        msgEmbed
            .setColor('#0099ff')
            .setThumbnail(chicken)
            .setTitle('INVENTORY=>')
            .setDescription(`<@${roleMention}> you have these in your inventory:`)
            .setTimestamp()
            .setFooter(`chicken Rewards #0.1k , invite people to get keys, Details requested by: ${msg.author.username}`, 'https://cdn.discordapp.com/emojis/859444593421320212.gif?v=1'); //arrow
        crateName = Object.keys(probFileObj)
        // let i = 0
        for (let i = 0; i < crateName.length; i++) {
            msgEmbed.addFields({
                name: `**${crateName[i]} Keys**`,
                value: workingFile[crateName[i]],
                inline: true
            })
        }

        if (args[0] == 'full') { //[prefix]inv full
            for (let i = 0; i < crateName.length; i++) {
                msgEmbed.addFields({
                    name: `**Total ${crateName[i]} Keys:**`,
                    value: workingFile['x' + crateName[i]],
                    inline: true
                })
            }
        }
        msg.channel.send(msgEmbed)
    } else {
        let data = {
            normie: 100,
            mid: 100,
            kord: 100,
            totaMoneyPurchase: 0,
            xnormie: 100, //all the 'x' starts represents how much total of that item the person have had
            xmid: 100,
            xkord: 100
        };
        fs.writeFile(
            './data/invs/' + nameOfFile,
            JSON.stringify(data, null, 2),
            function (err) {
                if (err) {
                    console.log('error making a file!');
                    console.log(err.message);
                    return;
                }
                msg.reply(` File succesfuly created! , please run the command again!`);
                return;
            }
        );
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
    } else if (mention.length = 18) {
        return mention
    }
}