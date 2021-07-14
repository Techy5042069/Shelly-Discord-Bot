module.exports = {
    cmdname: 'creator',
    exec(msg, args, msgEmbed, ping, obj) {
        // msg.mentions.
        return getfunc(msg, args, msgEmbed, ping, obj);
    }
};

function getfunc(msg, args, msgEmbed, ping, obj) {
    msgEmbed.setColor('#0099ff').setTitle('**LMAO , made my techy504#2069**')
    msg.channel.send(msgEmbed)
}