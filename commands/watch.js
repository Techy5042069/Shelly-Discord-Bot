// const fs = require('fs');
module.exports = {
    cmdname: 'gether',
    exec(msg, args, obj) {
        // msg.mentions.
        return getfunc(msg, args, obj);
    }
};
let mode = ['youtube', 'poker', 'chess', 'betrayal', 'fishing']

function getfunc(msg, args, obj) {
    togetherType = '';
    prefix = obj.prefix;
    msgEmbed = obj.msgEmbed;
    msgEmbed.setColor('#0099ff').setTitle('**2gether command**').setDescription(`**please use the following syntax:**: ${prefix}2gether [${mode.join(',')}]`)
    if (msg.member.voice.channel) {
        console.log(prefix, msgEmbed)
        if (args[0]) {
            // togetherType = mode[0];
            for (let i = 0; i < mode.length - 1; i++) {
                if (args[0] == mode[i]) {
                    togetherType = mode[i]
                }
            }
            obj.client.discordTogether.createTogetherCode(msg.member.voice.channelID, togetherType).then(async invite => {
                return msg.channel.send(`${invite.code}`)
            })
            console.log('laskdfj')
        } else if (togetherType = '') {
            msg.reply(msgEmbed)
            console.log('ye?')
        }
    } else {
        msg.reply('join some VC shit!')
        return;
    }
    console.log('running')
}