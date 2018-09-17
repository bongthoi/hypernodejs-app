import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';


/** */
import server_config from "./config/server_config.json";
import index from './src/controllers';

/** */
const app = express();
const PORT = server_config.server_port;

/** */
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());

app.use(flash());

app.use(function(req, res, next){
	res.locals.success_message = req.flash('success_message');
	res.locals.error_message = req.flash('error_message');
	res.locals.error = req.flash('error');
	res.locals.errors = req.flash('errors');
	res.locals.user = req.user || null;
  	next();
});

app.use('/', index);


/** */
app.listen(PORT, function(){
	console.log('Server is running on',PORT);
});