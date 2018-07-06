/*
module.exports = function(app) {
    var autenticar = require('./../middleware/autenticator')
    , chat = app.controllers.chat;
    app.get('/chat/:email', autenticar, chat.index);
};*/

module.exports = function(app) {
	var chat = app.controllers.chat;
	app.get('/chat/:email', chat.index);
};