var express = require('express')
, load = require('consign')
, cookieParser = require('cookie-parser')
, session = require('express-session')
, bodyParser = require('body-parser')
, methodOverride = require('method-override')
, error = require('./middleware/error')
, mongoose = require('mongoose')
, app = express();

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

load().include('models')
.then('controllers')
.then('routes')
.into(app);

// Executa após as rotas se não encontrado
app.use(error.notFound);
// Executa ao ocorrer um erro
app.use(error.serverError);



app.listen(3000, function(){
    console.log("Ntalk no ar.");
});
