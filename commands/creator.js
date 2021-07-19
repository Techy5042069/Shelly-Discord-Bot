module.exports = {
    cmdname: 'Kreator',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    }
};

async function getfunc(msg, args, obj) {
    msgEmbed.setColor('#0099ff').setTitle('**LMAO , made my techy504#2069**')
    await msg.channel.send(msgEmbed)
}