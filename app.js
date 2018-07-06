var express = require('express')
, http = require('http')
, load = require('consign')
, cookieParser = require('cookie-parser')
, session = require('express-session')
, bodyParser = require('body-parser')
, methodOverride = require('method-override')
, error = require('./middleware/error')
, mongoose = require('mongoose')
, app = express()
, server = http.Server(app)
, io = require('socket.io')(server);


var store = new session.MemoryStore();
var cookie = require('cookie');

// ...código do stack de configurações...
mongoose.connect('mongodb://localhost/ntalk');
global.db = mongoose.connection;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(session({
    secret: "abc123",
    name: 'ntalk',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));


io.use((socket, next) => {
	const cookieData = socket.request.headers.cookie;
	const cookieObj = cookie.parse(cookieData);
	const sessionHash = cookieObj['ntalk'] || '';
	const sessionID = sessionHash.split('.')[0].slice(2);

	store.all((err, sessions) => {
		const currentSession = sessions[sessionID];

		if (err || !currentSession) {
			return next(new Error('Acesso negado!'));
		}

		socket.handshake.session = currentSession;
		return next();
	});
});



// ...código da função load()...
load().include('models')
.then('controllers')
.then('routes')
.into(app);

load().include('sockets').into(io);


// Executa após as rotas se não encontrado
app.use(error.notFound);
// Executa ao ocorrer um erro
app.use(error.serverError);



server.listen(3000, function(){
    console.log("Ntalk no ar.");
});
