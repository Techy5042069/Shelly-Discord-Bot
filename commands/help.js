module.exports = {
    cmdname: 'help',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    },
};

function getfunc(msg, args, obj) {
    prefix = obj.prefix;
    obj.msgEmbed.setColor('#0099ff')
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
            value: `usage: ${prefix}prob, shows what crates are available and their rates`,
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
    msg.reply(obj.msgEmbed);
    return console.log("processed!")
}