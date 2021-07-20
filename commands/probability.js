const fs = require('fs');

module.exports = {
    cmdname: 'prob',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    },
};

async function getfunc(msg, args, obj) {
    probFileLocation = obj.config.probfile;
    let probabiltyFile = await JSON.parse(fs.readFileSync(probFileLocation))
    let keys = Object.keys(probabiltyFile)
    let msgEmbed = obj.msgEmbed.setColor('#0099ff')
        .setTitle('Probabiliites:')
        .setFooter(`note: 'U' infront of NFA and SFA means it's Unbanned , OF = optifine`)
    if (probabiltyFile.hasOwnProperty(args[0])) {
        getProbability(probabiltyFile, msgEmbed, msg, args)
    } else {
        noValidArg(keys, msg, msgEmbed, obj.prefix);
        // return;
    }
    return console.log('processed!!')
}

async function noValidArg(keys, msg, msgEmbed, prefix) {
    let keysOption = 'options: '
    keysOption += keys.join(' ,')
    msgEmbed
        .addFields({
            name: `**please use ${prefix}prob [options] to view the details of crate.** \nnote : this part is currently in development , will be completed soon`,
            value: keysOption
        });
    await msg.reply(msgEmbed);
    // return msgEmbed
}

function accurateCalc(r1, r2) {
    maxPrecision = 100
    // operations like 0.50 - 0.33 can be calcuated using this fuction , do 10^n where n number of the highest precision of the numbers
    return (r2 * maxPrecision - r1 * maxPrecision) / maxPrecision;
}

async function getProbability(probabiltyFile, msgEmbed, msg, args) {
    const { prob, rewards } = probabiltyFile[args[0]] //here prob and rewards are two different arrays inside prob.json file
    problen = prob.length //amount of reward in the choosen crate
    msgEmbed.setDescription(`${args[0]} crate has: ${problen} item(s)`)
    let cumulative = 0
    for (let i = 0; i < problen; i++) {
        //to see the structure go to use.js
        rewardArray = rewards[i].split(';')
        nextCumulative = prob[i] + cumulative
        msgEmbed.addFields({
            name: `**${rewardArray[1]}x ${rewardArray[0]}**`,
            value: `chances: ${ accurateCalc(cumulative , nextCumulative)}%`,
            inline: true,
        })
        cumulative = nextCumulative
    }
    // return msgEmbed;
    msg.reply(msgEmbed)
}