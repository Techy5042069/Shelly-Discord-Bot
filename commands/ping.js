module.exports = {
    cmdname: 'ping',
    exec(msg, args, obj) {
        getfunc(msg, args, obj); //this part is called from main handler file you now the app.js or index.js
    }
};


async function getfunc(msg, args, obj) {
    let msgEmbed = obj.msgEmbed;
    let m = await msg.channel.send('pinging....')
    msgEmbed.setColor('#0099ff')
        .setDescription(`**This bot ping is : **\ ${Math.round(obj.client.ws.ping)}ms\ \n **your ping is: ** ${m.createdTimestamp - msg.createdTimestamp}ms`)
    m.edit(msgEmbed)
    return console.log('processed!')
}