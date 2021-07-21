let constMsgEmbed
helps = {
    Use: {
        short: `use\``,
        full: `use [crateName]\`, shows what you have in your inventory`
    },
    Inventory: {
        short: `inv\``,
        full: `inv\`, shows what you have in your inventory \n inv full , shows full information`
    },
    Information: {
        short: `info\``,
        full: `info\`, shows what crates are available and their probability and Invites to Key rates`
    },
    Gether: {
        short: `gether\``,
        full: `gether [options]\` , watch/play games together`
    },
    Reedem: {
        short: `reedem\``,
        full: `reedem [reedem code]\` , used to reedem keys for crate`
    },
    Ping: {
        short: `ping\``,
        full: `ping\` , shows Bot and Your ping`
    },
    Help: {
        short: `help\``,
        full: `help\` , LMAO , shows help`
    },
    Kreator: {
        short: `kreator\``,
        full: `kreator\`, shows creator`
    }
}

module.exports = {
    cmdname: 'help',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    },
};

async function getfunc(msg, args, obj) {
    if (constMsgEmbed) {
        await msg.reply(constMsgEmbed)
        return console.log('processed')
    }
    if (args[0]) return sendFullCmdhelp(msg, args, obj)
    setGetDefaultHelp(obj.msgEmbed, obj.prefix, msg)
    return console.log("processed!")
}

function setGetDefaultHelp(objMsgEmbed, prefix, msg) {
    //this function will only run once to construct the helps object
    constMsgEmbed = objMsgEmbed.setColor('#0099ff')
        .setTitle('Help:')
        .setDescription(`Here are some commands currently available: \n do ${prefix}help [cmdname] to view more information on that command`);
    for (help in helps) {
        constMsgEmbed.addFields({
            name: `${help}`,
            value: `\`${prefix}${helps[help].short}`,
            inline: true
        })
    }
    msg.reply(constMsgEmbed)
}

function sendFullCmdhelp(msg, args, obj) {
    
}