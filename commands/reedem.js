let fs = require('fs')
module.exports = {
    cmdname: 'reedem',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    }
};

function getfunc(msg, args, obj) {
    let reedemFileLocation = obj.config.reedemfile;
    if (!fs.existsSync(reedemFileLocation)) {
        msg.reply(`Bruhh! , you don't have an entry , do ${obj.prefix}inv`)
        return
    }
    let reFile = JSON.parse(fs.readFileSync(reedemFileLocation))
    let reKeys = Object.keys(reFile)
    let hasValidArg = false;


    if (args[0] == 'add' && msg.member.hasPermission('ADMINISTRATOR') && args[1] && args[2] && args[3]) { //%reedem add <key> <cratename> <amount of keys>
        let newReedemRewards = addReedemCode(msg, args, obj);
        if (!newReedemRewards) { return; } //exit immeditely if the argument is wrong
        newReedemCode = args[1]
        reFile[newReedemCode] = newReedemRewards;
        hasValidArg = true;
    } else if (args[0]) {
        for (key of reKeys) {
            if (args[0] == key) {
                reFile[key] = loadKeysToAcc(msg, key, obj, reFile);
                hasValidArg = true;
                break;
            }
        }
    }
    if (!hasValidArg) {
        msg.reply('bruh! , gime some valid arguments')
        return;
    }

    data = JSON.stringify(reFile, null, 2)
    fs.writeFile(reedemFileLocation, data, err => {
        if (err) {
            console.log(err)
        }
    })
    console.log('processed!')
}

function loadKeysToAcc(msg, key, obj, reFile) {
    rew = reFile[key].split(';'); //eg. ['kord',3]
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

function addReedemCode(msg, args, obj) {
    probFileLocation = obj.config.probfile;
    let probFileObj = JSON.parse(fs.readFileSync(probFileLocation))
    let keys = Object.keys(probFileObj)
    if (args[3]>100){
        
    } 
    if (keys.includes(args[2])) {
        msg.reply('Reedem code added and is sent to you in DM')
        msgEmbed = obj.msgEmbed;
        msg.author.send(msgEmbed.setColor('#0099ff').setTitle('here is the information of the key that you added').addFields({
            name: 'Reedem Code',
            value: args[1]
        }, {
            name: 'crate',
            value: args[2]
        }, {
            name: 'no of keys',
            value: args[3]
        }))

        return `${args[2]};${args[3]}`;
    } else {
        msg.reply('wrong crate name , please use a valid crate name do: %prob to see all available crates')
    }
}