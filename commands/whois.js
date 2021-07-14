module.exports = {
	cmdname: 'whois',
	exec(msg, args) {
		getfunc(msg, args);
	},
};

function getfunc(msg, args) {
	msg.reply('yo! this command is ded already!')
}
