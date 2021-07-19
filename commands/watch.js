// const fs = require('fs');
module.exports = {
    cmdname: 'gether',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    }
};
let mod = ['youtube', 'poker', 'chess', 'betrayal', 'fishing']

function getfunc(msg, args, obj) {
    togetherType = '';
    prefix = obj.prefix;
    msgEmbed = obj.msgEmbed;
    msgEmbed.setColor('#0099ff').setTitle('**gether command**').setDescription(`**please use the following syntax:**: \n ${prefix}2gether [${mod.join(',')}]`)
    if (msg.member.voice.channel) {

    } else {
        msg.reply('join some VC shit!')
        return;
    }
    console.log('running')
}

function hasJoinedVc() {
    if (args[0]) {
        for (let i = 0; i < mod.length - 1; i++) {
            if (args[0] == mod[i]) {
                togetherType = mod[i]
                obj.client.discordTogether.createTogetherCode(msg.member.voice.channelID, mod[i]).then(async invite => {
                    return await msg.channel.send(`${invite.code}`)
                })
                break;
            }
        }
    }
    if (!args[0]) {
        msg.reply(msgEmbed)
    }
}