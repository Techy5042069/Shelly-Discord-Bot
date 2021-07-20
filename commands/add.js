const fs = require('fs')

module.exports = {
    cmdname: 'add',
    exec(msg, args, obj) {
        getfunc(msg, args, obj);
        console.log('processed!')
    }
};

function getfunc(msg, args, obj) {

    if (!msg.member.hasPermission('ADMINISTRATOR')) return
    if (args[0] = 'reedem') return getCreateReedemCode(msg, args, obj)
}

function addReedemCode(msg, args, obj) {
    return new Promise((resolve, reject) => {
        maxKeys = 50
        if (args[2] > maxKeys) return msg.reply(`Bruhhh , that's too much max: ${maxKeys}`)
        probFileLocation = obj.config.probfile;
        let probFileObj = JSON.parse(fs.readFileSync(probFileLocation))
        let keys = Object.keys(probFileObj)
        if (keys.includes(args[1])) {
            msg.reply('Reedem code added and is sent to you in DM')
            msgEmbed = obj.msgEmbed;
            msg.author.send(msgEmbed.setColor('#0099ff').setTitle('here is the information of the key that you added').addFields({
                name: 'Reedem Code',
                value: args[3]
            }, {
                name: 'crate',
                value: args[1]
            }, {
                name: 'no of keys',
                value: args[2]
            }))

            resolve(`${args[1]};${args[2]}`);
        } else {
            reject(msg.reply('wrong crate name , please use a valid crate name do: %prob to see all available crates'))
        }
    })
}


async function getCreateReedemCode(msg, args, obj) {
    const reedemFileLocation = obj.config.reedemFileLocation;
    let reedemFile = JSON.parse(fs.readFileSync(reedemFileLocation))
    // let reedemKeys = Object.keys(reedemFile)
    if (args[1] && args[2] && args[3]) { //%add reedem <cratename> <amount of keys> <key>
        let newReedemRewards = await addReedemCode(msg, args, obj);
        if (!newReedemRewards) { return; } //exit immeditely if the return val is falsy
        newReedemCode = args[3]
        reedemFile[newReedemCode] = newReedemRewards;
        // hasValidArg = true;
        // console.log(reedemFile)
        fs.writeFileSync(reedemFileLocation, JSON.stringify(reedemFile, null, 2))
    }
}