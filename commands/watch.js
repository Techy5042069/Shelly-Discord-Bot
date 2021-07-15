// const fs = require('fs');
module.exports = {
    cmdname: 'watch',
    exec(msg, args, obj) {
        // msg.mentions.
        return getfunc(msg, args, obj);
    }
};

function getfunc(msg, args, obj) {
    if (msg.member.voice.channel) {
        obj.client.discordTogether.createTogetherCode(msg.member.voice.channelID, 'youtube').then(async invite => {
            return msg.channel.send(`${invite.code}`);
        });
    }else{
        msg.reply('join some VC shit!')
    }
    console.log('runnig')
}