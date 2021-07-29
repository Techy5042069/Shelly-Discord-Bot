let fs = require('fs');
const Discord = require('discord.js');
const {probabilty} = require('./configs.js')
module.exports = {
    cmdname: 'use',
    exec(msg, args, obj) {
        getfunc(msg, args, obj); //this part is called from main handler file you now the app.js or index.js
    }
};

let timerStorage = {}


async function getfunc(msg, args, obj) {
    firstArg = args[0];
    let msgEmbed = obj.msgEmbed;
    let prefix = obj.prefix;
    if (firstArg == undefined) {
        //now checking first arg
        msgEmbed.setColor('#0099ff')
            .setTitle('bruhh gime some more detials')
            .addFields({
                name: `do : ${prefix}use [name of key] to use a key`,
                value: `eg: ${prefix}use normie`,
            }, {
                name: `do : ${prefix}inv , to see your inventory!`,
                value: `eg: ${prefix}inv`,
            })
        await msg.reply(msgEmbed);
        return;
    }


    let crate = Object.keys(probabilty) //add if you want more crate , but may requier code restructuing
    for (let i = 0; i < crate.length; i++) {
        if (firstArg == crate[i]) {
            //check other arg
            readMsg(msg, crate[i], prefix, obj);
            return console.log("processed!");
        }
    }
}

async function readMsg(message, crateName, prefix, obj) { //conformation blcok
    let filter = (m) => m.author.id === message.author.id;
    message.channel
        .send(`Are you sure to use ${crateName} ? \`YES\` / \`NO\``)
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
                        buyCrate(message, crateName, prefix, obj); //call XD
                    } else {
                        message.reply(
                            '\nCancelling...'
                        );
                    }
                })
                .catch((collected) => {
                    // console.log(collected)
                    message.reply('Timeout! please try again!');
                });
        });
}

function buyCrate(msg, crateName, prefix, obj) {
    //this function reads users data from ./inv/userid.json and checks if they can use a crate or not
    // if they cann't use it it says , that you don't ahve key
    //else if they have key it calls another function
    return new Promise((resolve, reject) => {
        nameOfFile = obj.config.invdir + msg.author.id + '.json';

        if (fs.existsSync(nameOfFile)) { //checks for entry

            let workingFile = JSON.parse(fs.readFileSync(nameOfFile));
            let noOfCrate = workingFile[crateName]; //rememberr you have to add entry in the user's JSON file , if you want more crate

            if (noOfCrate <= 0) { //noOfcrate meaning : if you use %use normie , here this code takes the [normie] key of your inv file that key stores amount of [normie] key that you have
                msg.reply(`you dumb shit! , get some keys at first! have 0 keys`);
            } else if (noOfCrate >= 0) { //you have keys for the requested crate
                workingFile[crateName] = finalizeProcess(msg, noOfCrate - 1, crateName, obj); //return value of this function deducts the amount of key of crate
                let data = JSON.stringify(workingFile, null, 2); //save workingFile , which is the inv file of the user loaded in node obj
                fs.writeFile(nameOfFile, data, err => {
                    if (err) console.log(err)
                });
            }

        } else {
            msg.reply(`you don't have any entry , please first make an entry by using [prefix]inv`);
        }
    })
}

function finalizeProcess(msg, num, crateName, obj) {
    //this function generated random num ,and compares them with probability of the respective crate 
    // if true , it takes the index of probability and gets rewards from rewards[indexOfProbability]
    //then makes embed and sends it to the peron
    //if person has a blocked dm or the bot can't dm the person , then a new channel is created and the msg is sent over there which is delete after X minutes
    const embedPicture = 'https://media.discordapp.net/attachments/862943946924621825/864148596639531048/standard_6.gif?width=230&height=230'
    const randomizer = Math.floor(Math.random() * Math.random() * 10000) / 100;
    const channelDeleteTime = obj.config.channelDeleteTime * 60 * 1000 //value in mimisecond
    let returnVal = num
    let kombo = '';
    let luckyIndex; //index of the reward
    let calculatedVar //probability of the reward won
    try {

        prob = probabilty[crateName].prob.length - 1; //checks amount of reward in the choosen crate
        let cumulative = 0
        let choosenKrate = probabilty[crateName].prob //
        for (let i = 0; i < prob; i++) {
            nextCumulative = choosenKrate[i] + cumulative
            if (cumulative < randomizer && randomizer <= nextCumulative) {
                luckyIndex = i;
                calculatedVar = nextCumulative - cumulative
                break;
            }
            cumulative = nextCumulative
        }
        console.log(luckyIndex)
        if (!luckyIndex) {
            msg.reply('some error occured, please try again')
            returnVal += 1
            return returnVal
        }

        rew = probabilty[crateName].rewards[luckyIndex]; //getting the reward element as a group like 'NFA;1'
        selectedRewardAcc = rew.split(';');
        fileLocation = obj.config.rewardsDir + selectedRewardAcc[0] + '.txt'; //just appending file name and .txt , note : in the reward element group : NFA is file name , so this name must be same as file.txt where file is the name of the account

        fileArr = fs.readFileSync(fileLocation, 'utf8').split('\n'); //filArr is array of accs from workingfile which is the acc file , of the respctive crate
        for (let i = 0; i < selectedRewardAcc[1]; i++) {
            kombo = kombo + fileArr.shift() + '\n'; //shit() return and removes the element from the arrray
        }

        if (kombo == '' || !kombo || kombo == undefined || kombo.split(':').length - 1 > selectedRewardAcc[1]) {
            msg.reply(`you have won ${selectedRewardAcc[1]} unbanned: ${selectedRewardAcc[2]} ${selectedRewardAcc[0]}  , but we are currently out of this type of acc, or we don't have enough acc to process your need please take a full screenshot and contact the admin , <@&859035937908195349> <@&859035851245092895> get your lazy ass over here! `);
            fileArr.append(kombo.substr(0, kombo.length - 2))
            console.log('it seems we are in lack of accs . successfuly saved from waste: ' + kombo)
            return num; //exit function immediatedly and num is subtracted
        }

        data = fileArr.join('\n'); //to save the file 
        fs.writeFile(fileLocation, data, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            //file written successfully
        });

        let newembed = createMsgEmbed(selectedRewardAcc, kombo, crateName, calculatedVar, num, randomizer, embedPicture)

        msg.author.send(newembed)
            .then(() => {
                msg.reply(`you have won ${selectedRewardAcc[1]} ${selectedRewardAcc[0]} check your DM!`)
            })

            .catch((err) => { //this is , if the user has a blocked dm
                let bdmsCategory = msg.guild.channels.cache.find(c => c.name == 'BDMS' && c.type == 'category')
                let bdmsCategoryId = bdmsCategory ? bdmsCategory.id : null
                let ID = msg.author.id;
                let channelName = 'bdm-' + ID; //bdm is blocked DM
                let chan = msg.guild.channels.cache.find(
                    (channel) => channel.name === channelName
                );
                if (chan) { //channel havers
                    clearTimeout(timerStorage[ID]);
                    chan.send(newembed);
                    chan.send('note: this channel will get delete in 10mins')
                    sendBlockedDm(msg, chan.id) //removes the previous delete counter if there already is a channel for that person
                    timerStorage[ID] = setTimeout(() => {
                        chan.delete();
                    }, channelDeleteTime);
                } else { //channel non-havers
                    createChannel(msg, channelName, bdmsCategoryId, newembed, ID)
                }
            });
    } catch (err) {
        if (err) {
            console.log('some error occured please try again!')
            console.log(err);
            returnVal += 1 //increase the deduced key amount 
        }
    }
    return returnVal
}

function createMsgEmbed(selectedRewardAcc, kombo, crateName, calculatedVar, num, randomizer, embedPicture) {
    return new Discord.MessageEmbed().setColor('#0099ff')
        .setTitle('Crate Unlocked Rewards!!')
        .setURL('https://bakedchicken.xyz')
        // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        .setDescription('You just opened a Crate here are you details:')
        .setThumbnail(embedPicture)
        .addFields({
            name: 'Account type:',
            value: selectedRewardAcc[0]
        }, {
            name: 'Account Credentials:',
            value: '||`' + kombo + '`||'
        }, {
            name: '\u200B',
            value: '\u200B'
        }, {
            name: 'No. of account won:',
            value: selectedRewardAcc[1],
            inline: true
        }, {
            name: 'Unbanned? (MC only)',
            value: selectedRewardAcc[0].startsWith('U'),
            inline: true
        }, {
            name: 'Crate Name:',
            value: crateName,
            inline: true
        }, {
            name: `Remaning ${crateName} key(s):`,
            value: num,
            inline: true
        }, {
            name: 'Probability For the reward:',
            value: calculatedVar + '%'
        }, {
            name: 'your generated number: ',
            value: randomizer,
            inline: true
        })
        .setTimestamp()
        .setFooter('chickenRewards#0.1k ,invite people to get keys', 'https://cdn.discordapp.com/emojis/859444593421320212.gif?v=1'); //arrow
}

async function createChannel(msg, channelName, bdmsCategoryId, newembed, ID) {
    await msg.guild.channels.create(channelName, {
            parent: bdmsCategoryId,
            type: 'text', //This create a text channel, you can make a voice one too, by changing "text" to "voice"
            permissionOverwrites: [{
                    id: msg.guild.roles.everyone.id, //to exclude everyone from the channel ,
                    deny: [
                        'VIEW_CHANNEL',
                        'SEND_MESSAGES',
                        'READ_MESSAGE_HISTORY'
                    ] //Allow permissions
                },
                {
                    id: ID, //To make it be seen by the person using their id
                    allow: [
                        'VIEW_CHANNEL',
                        'SEND_MESSAGES',
                        'READ_MESSAGE_HISTORY'
                    ] //Allow permissions
                }
            ]
        })
        .then((t) => {
            //here t is the object of channel that was created!
            t.send(newembed);
            t.send('note: this channel will get delete in 10mins')
            sendBlockedDm(msg, t.id)
            timerStorage[ID] = setTimeout(() => {
                t.delete();
            }, channelDeleteTime);
            return t;
        });
}

function sendBlockedDm(msg, id) {
    msg.reply(`it seems you dm is blocked!please move to this <#${id}> channel to claim your reward!, channel will be automatically deleted in 10 min `);
}