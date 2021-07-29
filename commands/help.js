let constMsgEmbed
let constAdminMsgHelp
const { adminhelps, helps } = require('./configs.js') //not to be confused with config.json
// console.log(adminhelps, helps)
module.exports = {
    cmdname: 'help',
    exec(msg, args, obj) {
        getfunc(msg, args, obj);
        return console.log('processed')
    },
};

async function getfunc(msg, args, obj) {

    if (msg.member.hasPermission('ADMINISTRATOR') && args[0] == 'admin') {
        return sendAdminHelp(msg, args, obj)
    }
    if (args[0]) {
        checkCmd(msg, args, obj)
        return;
    }
    if (constMsgEmbed) {
        return await msg.reply(constMsgEmbed)
    }
    setGetDefaultHelp(obj.msgEmbed, obj.prefix, msg)
    return console.log("processed!")
}

function setGetDefaultHelp(objMsgEmbed, prefix, msg) {
    //this function will only run once to construct the helps object
    constMsgEmbed = objMsgEmbed.setColor('#0099ff')
        .setTitle('Help:')
        .setDescription(`Here are some commands : \n do ${prefix}help [cmdname] to view more information on that command \n **Prefix: ${prefix}**`);
    for (help in helps) {
        constMsgEmbed.addFields({
            name: `${help}`,
            value: `\`${prefix}${helps[help].short}\``,
            inline: true
        })
    }
    msg.reply(constMsgEmbed)
}

function sendAdminHelp(msg, args, obj) {
    constAdminMsgHelp = obj.msgEmbed.setColor('#0099ff')
        .setTitle('Help:')
        .setDescription(`Here are some admin commands: \n do ${obj.prefix}help [cmdname] to view more information on that command \n **Prefix: ${obj.prefix}**`);
    for (help in adminhelps) {
        let fullHelp = ''
        for (f of adminhelps[help].cmd) {
            fullHelp += `\`${obj.prefix}${f}\`\n`
        }
        constAdminMsgHelp.addFields({
            name: `${help}`,
            value: `${fullHelp}${adminhelps[help].note}`,
        })
    }
    msg.reply('help sent to your dm').catch(err => {
        console.log(err)
        msg.reply('something went wrong pls contact admin error code: HELP-CMDHELP')
    })
    msg.author.send(constAdminMsgHelp)
    msg.delete();
}

function checkCmd(msg, args, obj) {
    foundCmd = false
    for (help in helps) {
        if (args[0] == help.toLowerCase()) {
            sendCmdHelp(msg, obj)
            break;
        }
    }
    if (!foundCmd) return msg.reply('Bruhh , not a valid command')
}

function sendCmdHelp(msg, obj) {
    let cmdFullHelp = ''
    for (f of helps[help].cmd) {
        cmdFullHelp += `\`${obj.prefix}${f}\`\n`
    }
    obj.msgEmbed.setColor('#0099ff').setDescription(`Here are some information on **${help}** command \n note: <> means opitonal , [] means required`)
        .addFields({
            name: `\`${help}\``,
            value: `${cmdFullHelp}${helps[help].note}`
        })
    msg.reply(obj.msgEmbed)
    foundCmd = true
}