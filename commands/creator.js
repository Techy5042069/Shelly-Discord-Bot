module.exports = {
    cmdname: 'Kreator',
    exec(msg, args, obj) {
        // msg.mentions.
        return getfunc(msg, args, obj);
    }
};

function getfunc(msg, args, obj) {
    msgEmbed.setColor('#0099ff').setTitle('**LMAO , made my techy504#2069**')
    msg.channel.send(msgEmbed)
}