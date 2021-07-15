// const fs = require('fs');
module.exports = {
    cmdname: 'watch',
    exec(msg, args, obj) {
        // msg.mentions.
        return getfunc(msg, args, obj);
    }
};
let mode = ['youtube', 'poker', 'chess', 'betrayal', 'fishing']
function getfunc(msg, args, obj) {
    if (msg.member.voice.channel) {
        if (!args[0]) {
            togetherType = mode[0];
        } else {
            for (let i = 0; i < mode.length - 1; i++) {
                if (args[0] == mode[i]) {
                    togetherType = mode[i]
                    break;
                }
            }
        }
    } else {
        msg.reply('join some VC shit!')
        return;
    }
    obj.client.discordTogether.createTogetherCode(msg.member.voice.channelID, togetherType).then(async invite => {
        return msg.channel.send(`${invite.code}`);
    })
    console.log('runnig')
}