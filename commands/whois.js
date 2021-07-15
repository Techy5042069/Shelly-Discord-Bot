module.exports = {
	cmdname: 'whois',
	exec(msg, args,obj) {
		getfunc(msg, args,obj);
	},
};

function getfunc(msg, args,obj) {
	msg.reply('yo! this command is ded already!')
}
