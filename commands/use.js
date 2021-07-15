let fs = require('fs');
const Discord = require('discord.js');
module.exports = {
    cmdname: 'use',
    exec(msg, args,obj) {
        getfunc(msg, args,obj); //this part is called from main handler file you now the app.js or index.js
    }
};

/* example:
    normie: {
        prob:['0-90','90-99','99-100'],, 

        working method: a functino wil genrate random num from 0 too 100 , if the num is in any of the range, it will take that index of range and that index will determine the reward from next reaward[]
        note please keep thee ranges in ascending order: like : ['lowerval-higerval','lowerval-higherval']

        rewards: ['NFA;1',SFA;1]  //reward of corressponding prob[]

        
        here 'NFA;1' means 'acctype;noofacc'
        make sure to keep that format else the program might break and the reward to the person might get bugged
        and make sure to keep corresponding rewards separated by commas and qutoes ' or "
*/
let probabilty = {
    normie: {
        prob: ['0-60', '60-72', '72-97', '97-99', '99-100'], //probabilty of reward in range, 
        rewards: ['NFA;1', 'SFA;1', 'napster;1', 'UNFA;1', 'USFA;1'] //it's like 0-90 corresponds to 'NFA;1' and 99-100 corresponds to 'SFA;1'
    },
    mid: {
        prob: ['0-38', '38-53', '53-80', '80-89', '89-93', '93-96', '96-98', '98-99', '99-100'],
        rewards: ['NFA;2', 'SFA;2', 'napster;5', 'crunchyroll;1', 'UNFA;2', 'USFA;1', 'hypixelRankedNFA;1', 'hypixelLeveledSFA;1', 'OFNFA;1']
    },
    kord: {
        prob: ['0-26', '26-40', '40-55', '55-65', '65-74', '74-83', '83-89', '89-95', '95-100'],
        rewards: ['NFA;5', 'SFA;4', 'UNFA;3', 'USFA;2', 'hypixelRankedNFA;1', 'hypixelLeveledNFA;1', 'hypixelRankedSFA;1', 'hypixelLeveledSFA;1', 'OFNFA;1']

    }
};
//discord check mail
// data = JSON.stringify(probabilty, null, 2)
// fs.writeFileSync('./data/prob.json', data) //run this code once after updating probaility
//make sure to backup current file
let timerStorage = {}


function getfunc(msg, args,obj) {
    //add if you want to but, add functions above too to XD
    firstArg = args[0];
    let msgEmbed = obj.msgEmbed;
    let prefix = obj.prefix;
    // storing some arguments ofc!
    if (firstArg == undefined) {
        //now checking first arg
        //runs on [prefix]key
        msgEmbed.setColor('#0099ff')
            .setTitle('bruhh gime some more detials')
            .addFields({
                name: `do : ${prefix}use [name of key] to use a key`,
                value: `eg: ${prefix}use normie`,
            }, {
                name: `do : ${prefix}inv , to see your inventory!`,
                value: `eg: ${prefix}inv`,
            })
        msg.reply(msgEmbed);
        return;
    }

    let crate = ['normie', 'mid', 'kord']; //add if you want more crate , but may requier code restructuing
    for (let i = 0; i < crate.length; i++) {
        if (firstArg == crate[i]) {
            //check other arg
            readMsg(msg, crate[i], prefix);
            return console.log("processed!");
        }
    }
    // return console.log("processed!")
}

function readMsg(message, crateName, prefix) { //conformation blcok
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
                    if (
                        message.content.toUpperCase() == 'YES' ||
                        message.content.toUpperCase() == 'Y'
                    ) {
                        buyCrate(message, crateName, prefix); //call XD
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

function buyCrate(msg, crateName, prefix) { //read user data , and process accordingly
    //this function reads users data from ./inv/userid.json and checks if they can use a crate or not
    // if they cann't use it it says , that you don't ahve key
    //else if they have key it calls another function
    nameOfFile = './data/invs/' + msg.author.id + '.json';
    if (fs.existsSync(nameOfFile)) { //checks for entry
        let workingFile = JSON.parse(fs.readFileSync(nameOfFile));
        let noOfCrate = workingFile[crateName]; //rememberr you have to add entry in the user's JSON file , if you want more crate
        if (noOfCrate <= 0) { //noOfcrate meaning : if you use %use normie , here this code takes the [normie] key of your inv file that key stores amount of [normie] key that you have
            msg.reply(`you dumb shit! , get some keys at first! have 0 keys`);
        } else if (noOfCrate >= 0) { //you have keys for the requested crate
            workingFile[crateName] = finalizeProcess(msg, noOfCrate - 1, crateName); //return value of this function deducts the amount of key of crate
        }
        let data = JSON.stringify(workingFile, null, 2); //save workingFile , which is the inv file of the user loaded in node obj
        fs.writeFileSync(nameOfFile, data);
        delete data
    } else {
        msg.reply(`you don't have any entry , please first make an entry by using [prefix]inv`);
    }
}

function finalizeProcess(msg, num, crateName) { //do the final stuffs
    //this function generated random num ,and compares them with probability of the respective crate 
    // if true , it takes the index of probability and gets rewards from rewards[indexOfProbability]
    //then makes embed and sends it to the peron
    //if person has a blocked dm or the bot can't dm the person , then a new channel is created and the msg is sent over there which is delete after X minutes
    let returnVal = num
    try {
        let randomizer = Math.floor(Math.random() * Math.random() * 10000) / 100;
        // console.log(randomizer)
        let luckyIndex; //index of the reward
        let calculatedVar //probability of the reward won
        // let rangeArr;
        prob = probabilty[crateName].prob.length; //checks amount of reward in the choosen crate
        for (let i = 0; i < prob; i++) {
            [r1, r2] = probabilty[crateName].prob[i].split('-')
            if (r1 < randomizer && randomizer <= r2) {
                luckyIndex = i;
                calculatedVar = r2 - r1;
                // rangeArr = [r1,r2]
                break;
            }
        }

        rew = probabilty[crateName].rewards[luckyIndex]; //getting the reward element as a group like 'NFA;1'
        rewArr = rew.split(';');
        // fileLocation = ; //filelocation for accs
        fileLocation = './data/accs/' + rewArr[0] + '.txt'; //just appending file name and .txt , note : in the reward element group : NFA is file name , so this name must be same as file.txt where file is the name of the account
        // let workingFile = ; //.toString(); //read the file
        fileArr = fs.readFileSync(fileLocation, 'utf8').split('\n'); //filArr is array of accs from workingfile which is the acc file , of the respctive crate
        let kombo = ''; //this is to be send kombo 
        for (let i = 0; i < rewArr[1]; i++) {
            kombo = kombo + fileArr.shift() + '\n'; //shit() return and removes the element from the arrray
        }

        // console.log(kombo.split(':').length)
        if (kombo == '' || !kombo || kombo == undefined || kombo.split(':').length - 1 > rewArr[1]) {
            msg.reply(`you have won ${rewArr[1]} unbanned: ${rewArr[2]} ${rewArr[0]}  , but we are currently out of this type of acc, or we don't have enough acc to process your need please take a full screenshot and contact the admin , <@&859035937908195349> <@&859035851245092895> get your lazy ass over here! `);
            fileArr.append(kombo.substr(0, kombo.length - 2))
            console.log('it seems we are in lack of accs . successfuly saved from waste: ' + kombo.substr(0, kombo.length - 2))
            return num; //exit function immediatedly and num is subtracted
        }

        data = fileArr.join('\n'); //save the file 
        // console.log(data + 'yep!');
        fs.writeFile(fileLocation, data, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            //file written successfully
        });
        let chicken = 'https://media.discordapp.net/attachments/862943946924621825/864148596639531048/standard_6.gif?width=230&height=230'
        let newembed = new Discord.MessageEmbed().setColor('#0099ff')
            .setTitle('Crate Unlocked Rewards!!')
            .setURL('https://bakedchicken.xyz')
            // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('You just opened a Crate here are you details:')
            .setThumbnail(chicken)
            .addFields({
                name: 'Account type:',
                value: rewArr[0]
            }, {
                name: 'Account Credentials:',
                value: '||`' + kombo + '`||'
            }, {
                name: '\u200B',
                value: '\u200B'
            }, {
                name: 'No. of account won:',
                value: rewArr[1],
                inline: true
            }, {
                name: 'Unbanned? (MC only)',
                value: rewArr[0].startsWith('U'),
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
            // .setImage(chicken)
            .setFooter('chickenRewards#0.1k ,invite people to get keys', 'https://cdn.discordapp.com/emojis/859444593421320212.gif?v=1'); //arrow
        let bdmsCategory = msg.guild.channels.cache.find(c => c.name == 'BDMS' && c.type == 'category')
        msg.author.send(newembed)
            .then(() => {
                msg.reply(`you have won ${rewArr[1]} ${rewArr[0]} check your DM!`)
            })

            .catch((err) => { //this is , if the user has a blocked dm
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
                    }, 60000);
                } else { //channel non-havers
                    msg.guild.channels.create(channelName, {
                            parent: bdmsCategory.id,
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
                            }, 60000);
                            return t;
                        });
                }
                //start--common-for-bot-channel-havers-and-non-havers
                // console.log(channy)
                //end--common-for-bot-channel-havers-and-non-havers
            });
    } catch (err) {
        if (err) {
            console.log('some error occured please try again!')
            console.log(err);
            returnVal += 1
        }
    }
    return returnVal
}

function sendBlockedDm(msg, id) {
    msg.reply(`it seems you dm is blocked!please move to this <#${id}> channel to claim your reward!, channel will be automatically deleted in 10 min `);
}