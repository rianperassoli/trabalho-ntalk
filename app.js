var express = require('express')
, http = require('http')
, socketIO = require('socket.io')
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



// ...código da função load()...
load().include('models')
.then('controllers')
.then('routes')
.into(app);



io.sockets.on('connection', function (client) {
	client.on('send-server', function (data) {
		var msg = "<b>"+data.nome+":</b> "+data.msg+"<br>";
		client.emit('send-client', msg);
		client.broadcast.emit('send-client', msg);
	});
});



// Executa após as rotas se não encontrado
app.use(error.notFound);
// Executa ao ocorrer um erro
app.use(error.serverError);



server.listen(3000, function(){
    console.log("Ntalk no ar.");
});
