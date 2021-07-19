module.exports = {
    cmdname: 'fkbake',
    exec(msg, args,obj) {
        getfunc(msg, args);
    }
};

async function getfunc(msg, args) {
    channel = msg.channel;
    await msg.delete()
    for (let i = 1; i < 25; i++) {
        await channel
            .send(`<@771954313672261652>`)
            .then((msg) => {
                setTimeout(() => msg.delete(), 1000);
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
    }
}