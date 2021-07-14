module.exports = {
    cmdname: 'help',
    exec(msg, args, msgEmbed, prefix) {
        return getfunc(msg, args, msgEmbed, prefix);
    },
};

function getfunc(msg, args, msgEmbed, prefix) {
    msgEmbed.setColor('#0099ff')
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
        },{
            name: "**PROBABILITY**",
            value: `usage: ${prefix}prob, shows what crates are available and their rates`,
            // inline: true
        })
    msg.reply(msgEmbed);
    return console.log("processed!")
}