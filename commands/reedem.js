let fs = require('fs')
module.exports = {
    cmdname: 'reedem',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    }
};

async function getfunc(msg, args, obj) {
    const reedemFileLocation = obj.config.reedemFileLocation;
    const userInventoryFileLocation = obj.config.invdir + msg.author.id + '.json';
    if (!fs.existsSync(userInventoryFileLocation)) {
        msg.reply(`Bruhh! , you don't have an entry , do ${obj.prefix}inv`)
        return
    }

    let reedemFile = JSON.parse(fs.readFileSync(reedemFileLocation))
    let reedemKeys = Object.keys(reedemFile)
    let hasValidArg = false;
    if (args[0]) {
        for (key of reedemKeys) {
            if (args[0] == key) {
                reedemFile[key] = loadKeysToAcc(msg, key, obj, reedemFile);
                hasValidArg = true;
                break;
            }
        }
    }

    if (!hasValidArg) {
        msg.reply('bruh! , gime some valid arguments')
        return;
    }

    data = JSON.stringify(reedemFile, null, 2)
    fs.writeFile(reedemFileLocation, data, err => {
        if (err) {
            console.log(err)
        }
    })
    console.log('processed!')
}

function loadKeysToAcc(msg, key, obj, reedemFile) {
    console.log(reedemFile)
    rew = reedemFile[key].split(';'); //eg. ['kord',3]
    fileLocation = `${obj.config.invdir}${msg.author.id}.json`
    let invFile = JSON.parse(fs.readFileSync(fileLocation))
    invFile[rew[0]] += parseInt(rew[1])
    invFile['x' + rew[0]] += parseInt(rew[1])
    let msgEmbed = obj.msgEmbed;
    msgEmbed.setColor('#0099ff').setTitle('**Successfully reedemed the following: **').setDescription(`crate: ${rew[0]} \n no. of keys: ${rew[1]}`)
    // msg.setDescription()
    msg.reply(msgEmbed)
    let data = JSON.stringify(invFile, null, 2)
    fs.writeFile(fileLocation, data, err => {
        if (err) {
            console.log(err)
        }
    })
    return;
}