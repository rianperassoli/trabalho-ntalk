const autenticar = require('./../middleware/autenticator');

module.exports = function(app) {
	var chat = app.controllers.chat;
	
	app.get('/chat', autenticar, chat.index);
};