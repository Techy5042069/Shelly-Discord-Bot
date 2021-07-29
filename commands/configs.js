//this file contains all the configurables , if you keep the structure nothing should break ;D
const fs = require('fs')
helps = {
    // inv <full> , here <> means optional
    // reedem [code] , here [] means required
    Use: {
        short: `use`,
        cmd: [`use [crateName]`],
        note: `To open a crate using the key that you have`
    },
    Inventory: {
        short: `inv`,
        cmd: `inv <option>`,
        note: `shows what you have in your inventory \n inv full , shows full information`
    },
    Information: {
        short: `info`,
        cmd: `info <options>`,
        note: `shows what crates are available and their probability and Invites to Key rates`
    },
    Gether: {
        short: `gether`,
        cmd: `gether <options>`,
        note: `watch/play games together`
    },
    Reedem: {
        short: `reedem`,
        cmd: [`reedem [reedem code]`],
        note: `used to reedem keys for crate`
    },
    Ping: {
        short: `ping`,
        cmd: [`ping`],
        note: `shows Bot and Your ping`
    },
    Help: {
        short: `help`,
        cmd: [`help <command Name>`],
        note: `LMAO , shows help`
    },
    Kreator: {
        short: `kreator`,
        cmd: [`kreator`],
        note: `shows creator`
    }
}

adminhelps = {
    // full: must have command and note: must have a description
    add: {
        cmd: [`add reedem <box/cratename> <number of keys> <code>`, ` add invites <mention/ID> <amt of invites>`],
        note: `you can use negative value to deduce amts, try a negative reedem code <:KEKW:788648787719356436>`
    },
    convert: {
        cmd: [`conv <mention/ID> <crateName> <amt of invites to convert>`],
        note: `none`
    },
    inventory: {
        cmd: [`inv <mention/ID>`],
        note: `shows the full inventory stats of the person`
    }
}


let probabilty = {
    normie: {
        prob: [60, 12, 20, 2, 1], //probabilty of reward in percentage, put respective prob and rewards like 12% corresponds to 'SFA;1' 
        rewards: ['NFA;1', 'SFA;1', 'napster;1', 'UNFA;1', 'USFA;1'],
        invitesForAKey: 2
    },
    mid: {
        prob: [38, 15, 27, 9, 4, 3, 2, 1, 1],
        rewards: ['NFA;2', 'SFA;2', 'napster;5', 'crunchyroll;1', 'UNFA;2', 'USFA;1', 'hypixelRankedNFA;1', 'hypixelLeveledSFA;1', 'OFNFA;1'],
        invitesForAKey: 10
    },
    kord: {
        prob: [26, 14, 15, 10, 9, 9, 6, 6, 5],
        rewards: ['NFA;5', 'SFA;4', 'UNFA;3', 'USFA;2', 'hypixelRankedNFA;1', 'hypixelLeveledNFA;1', 'hypixelRankedSFA;1', 'hypixelLeveledSFA;1', 'OFNFA;1'],
        invitesForAKey: 25
    }
}

data = JSON.stringify(probabilty, null, 2) //these 2 line are to update the prob file in ./data/prob.json at defualt
fs.writeFileSync('./data/prob.json', data)
module.exports = { helps, adminhelps, probabilty }