// let appJs = require('../app.js')
// let date = require('date')
module.exports = {
    cmdname: 'ping',
    exec(msg, args, MsgEmbed, prefix, obj) {
        getfunc(msg, args, MsgEmbed, prefix, obj); //this part is called from main handler file you now the app.js or index.js
    }
};


async function getfunc(msg, args, MsgEmbed, prefix, obj) {
    //let m = await msg.channel.send('pinging...')
    //var yourping = m.createdTimestamp - msg.createdTimestamp
    //console.log(obj.client)
    let m = await msg.channel.send('pinging....')
    MsgEmbed.setColor('#0099ff')
        .setDescription(`**This bot ping is : **\`${Math.round(obj.client.ws.ping)}ms\ \n **your ping is: ** ${m.createdTimestamp - msg.createdTimestamp}ms`)
    m.edit(MsgEmbed)
    return console.log('processed!')
}