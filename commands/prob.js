const fs = require('fs');

module.exports = {
    cmdname: 'prob',
    exec(msg, args, obj) {
        return getfunc(msg, args, obj);
    },
};

function getfunc(msg, args, obj) {
    probFileLocation = obj.config.probfile;
    let probFileObj = JSON.parse(fs.readFileSync(probFileLocation))
    let keys = Object.keys(probFileObj)

    let msgEmbed = obj.msgEmbed.setColor('#0099ff')
        .setTitle('Probabiliites:')
        .setFooter(`note: 'U' infront of NFA and SFA means it's Unbanned , OF = optifine`)

    if (probFileObj.hasOwnProperty(args[0])) {
        // let calcedprob
        const { prob, rewards } = probFileObj[args[0]]
        // console.log(prob, rewards)
        problen = prob.length //checks amount of reward in the choosen crate
        msgEmbed.setDescription(`${args[0]} crate has: ${problen} item(s)`)
        for (let i = 0; i < problen; i++) {
            rewArr = rewards[i].split(';')
            rng = prob[i]
            r = rng.split('-');
            // console.log(r)
            // calcedprob = r[1] - r[0]
            msgEmbed.addFields({
                name: `**${rewArr[1]}x ${rewArr[0]}**`,
                value: `chances: ${accurateCalc(r[0],r[1])}%`, //to be tried : `chances: ${calcedprob}%` 
                inline: true,
            })
        }
    } else {
        noValidArg(keys, msg, msgEmbed, obj.prefix);
        return;
    }
    msg.reply(msgEmbed)
    //send default msg , if arg[0] is not given or valid
}

function noValidArg(keys, msg, msgEmbed, prefix) {
    let keysOption = 'options: '
    // console.log(keys)
    keysOption += keys.join(' ,')
    msgEmbed
        .addFields({
            name: `**please use ${prefix}prob [options] to view the details of crate.** \nnote : this part is currently in development , will be completed soon`,
            value: keysOption
        });
    msg.reply(msgEmbed);
    // return msgEmbed
}

function accurateCalc(r1, r2) {
    return (r2 * 100 - r1 * 100) / 100;
}