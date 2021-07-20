let constMsgEmbed
module.exports = {
    cmdname: 'help',
    exec(msg, args, obj) {
        setHelpEmbed(obj.msgEmbed,obj.prefix)
        return getfunc(msg, args, obj);
    },
};

async function getfunc(msg, args, obj) {
    if (constMsgEmbed) {
        await msg.reply(constMsgEmbed)
        return console.log('processed')
    }
    await msg.reply(setHelpEmbed(obj.msgEmbed,obj.prefix));
    return console.log("processed!")
}
function setHelpEmbed (objMsgEmbed,prefix) { //this fuction only run once , to make the help msg embed
    constMsgEmbed =  objMsgEmbed.setColor('#0099ff')
        .setTitle('Help:')
        .setDescription('Here are some commands currently available:')
        .addFields({
            name: "PREFIX",
            value: 'current prefix: ' + prefix,
            // inline: true
        }, {
            name: "**INVENTORY**",
            value: `usage: ${prefix}inv, shows what you have in your inventory \n ${prefix}inv full , shows full information`,
            // inline: true
        }, {
            name: "**USE**",
            value: `usage: ${prefix}use [keyname], to use up a key and open the respective crate`,
            // inline: true
        }, {
            name: "**PROBABILITY**",
            value: `usage: ${prefix}info, shows what crates are available and their rates`,
            // inline: true
        }, {
            name: "**gether**",
            value: `usage: ${prefix}gether, watch and play things together`,
            // inline: true
        }, {
            name: "**Reedem**",
            value: `usage: ${prefix}reedem , used to reedem keys for crate`,
            // inline: true
        }, {
            name: "**Creator**",
            value: `usage: ${prefix}kreator, shows creator`,
            // inline: true
        })
        return constMsgEmbed
    // return msgEmbed
}

// %add reedem <crate> <num> <code> 