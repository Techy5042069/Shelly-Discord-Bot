const fs = require('fs')
let canUseConv
module.exports = {
    cmdname: 'conv',
    exec(msg, args, obj) {
        if (args.length != 3) return msg.reply('bruhhhhh, give valid arugments')
        canUseConv = msg.member.hasPermission('ADMINISTRATOR') && args[0] && args[1] && args[2]
        if (canUseConv) getfunc(msg, args, obj);
        console.log('processed!')
    }
};

async function getfunc(msg, args, obj) {
    const mentioned = args.shift()
    const [crateName, invitesToBeConverted] = args
    const probabilityFile = await JSON.parse(fs.readFileSync(obj.config.probfile)) //probability json file, 
    crateNames = Object.keys(probabilityFile) //using probability file because it has all the crate/box info
    if (!crateNames.includes(crateName)) return await msg.reply('BRUH.. give me some valid crate name')
    if (invitesToBeConverted < probabilityFile.invitesForAKey) return msg.reply(`value less than minimum key required for the box/crate`)

    let mentionedPerson = await getTragetUser(msg, mentioned)
    userFileLocation = obj.config.invdir + mentionedPerson + '.json'
    // console.log(userFileLocation)
    if (!fs.existsSync(userFileLocation)) return msg.reply(`You don't have an entry , do ${obj.prefix}inv then try again!`)
    confirmConvert(msg, crateName, invitesToBeConverted, userFileLocation, obj, probabilityFile[crateName].invitesForAKey)
    // convertInvitesToKeys(msg, crateName, invitesToBeConverted, userFileLocation, obj, probabilityFile.invitesForAKey)
}



function getUserFromMention(mention, msg) {
    if (!mention || mention.length != 18 || !Number.isInteger(mention)) return msg.author.id;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return mention;
    } else if (mention.length = 18) { //18 is the length of snowflake
        return mention
    }
}

async function getTragetUser(msg, mention) {
    if (canUseConv) {
        mentionedPerson = await getUserFromMention(mention, msg);
    } else {
        mentionedPerson = msg.author.id
    }
    // console.log(roleMention, nameOfFile)
    return mentionedPerson //Check config.json for invdir
}

async function convertInvitesToKeys(msg, crateName, invitesToBeConverted, userFileLocation, obj, invitesForAKey) {
    userInventoryFile = await JSON.parse(fs.readFileSync(userFileLocation))
    if (userInventoryFile.invites <= 0) return await msg.reply(`you don't have enough invites`)
    const [amtOfKeys, remainder] = getKeysAndRem(invitesToBeConverted, invitesForAKey)
    userInventoryFile[crateName] += amtOfKeys
    usedUserInvites = invitesToBeConverted - remainder
    userInventoryFile.invites -= usedUserInvites
    msgEmbed = obj.msgEmbed.setColor('#0099ff').setTitle('Successfuly converted the following: ')
        .setDescription(`**Rate of Conversion:  ${invitesForAKey} invites -> 1 ${crateName} keys \n Converted ${usedUserInvites} to ${amtOfKeys} ${crateName} keys **`)
    fs.writeFileSync(userFileLocation, JSON.stringify(userInventoryFile, null, 2), err => {
        if (err) console.log(err)
    })
    msg.reply(msgEmbed)
}

function getKeysAndRem(invitesToBeConverted, invitesForAKey) {
    return [Math.floor(invitesToBeConverted / invitesForAKey), invitesToBeConverted % invitesForAKey]
}

function confirmConvert(message, crateName, invitesToBeConverted, userFileLocation, obj, invitesForAKey) {
    let filter = (m) => m.author.id === message.author.id;
    message.channel
        .send(`Are you sure to convert your keys? \`YES\` / \`NO\``)
        .then(() => {
            message.channel
                .awaitMessages(filter, {
                    max: 1,
                    time: 15000, //timeout in ms for conformation block
                    errors: ['time']
                })
                .then((message) => {
                    // console.log(message)
                    message = message.first();
                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                        convertInvitesToKeys(message, crateName, invitesToBeConverted, userFileLocation, obj, invitesForAKey)
                    } else {
                        message.reply(
                            '\nCancelling...'
                        );
                    }
                })
                .catch((collected) => {
                    message.reply('Timeout! please try again!');
                });
        });
}