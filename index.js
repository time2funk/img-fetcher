'use strict';
const path 			 = require('path');
const http 			 = require('http');
const express 		 = require('express');
const expressLogging = require('express-logging');
const logger 		 = require('logops');
const bodyParser 	 = require('body-parser');
const cookieSession  = require('cookie-session');
const favicon 		 = require('serve-favicon');
const socketIo		 = require('socket.io');

const port = process.env.PORT | 1423;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', function(client){ // client = socket
	console.log('client connect');
	client.on('event', function(data){
		console.log('client event');
	});
	client.on('disconnect', function(){
		console.log('client disconnect');
		// do nothing
	});
	client.on('reply', function(data){
		console.log('client reply');
    	console.log(data);
	}); // listen to the event
    client.on('join', function(data) {
		console.log('client join');
    	console.log(data);
	});
});
// io.emit('notify', {
//     title: 'nightmare video link',
//     messages: result
// });

app.set('port', port );
// app.set('views', dir + '/views');
// app.set('view engine', 'ejs');
// app.set('env', 'development');
app.set('env', 'evil');
app.use( expressLogging(logger)) ;
// app.use( express.static(dir + '/public') );
app.use( bodyParser.json({limit: '50mb'}) );
app.use( bodyParser.urlencoded({ extended: false,limit: '50mb', parameterLimit:50000 }) );
// app.use( favicon('public/favicon.ico'));
app.use( cookieSession({
	name: 'session',
	// secret: '2abh1y235kiu.bvcew32def',
	keys: ['pass', 'test'],
	maxAge: 24 * 60 * 60 * 1000 // 24h
}));
app.use( (request, response, next) => {
	var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	console.log('\n_________\n');
	console.log('Client IP:', ip);
	console.log(request.method);
	console.log(request.url);
	console.log(request.body);
	console.log(request.session);
	console.log('________\n');
	if(request.url == '/login') next();
	else{
		request.session.test ='test';
		if(request.session.pass == '2abh1y235kiu.bvcew32def'){
			next();
		}else{
			response.redirect('/login');
		}
	}

});	

app.get('/login', (request, response) => { 
	response.render('pages/login',{});
}); 
app.post('/login', (request, response) => { 
	let login = request.body.login;
	let password = request.body.password;

	if(login == "admin" && password == "admin"){
		request.session.pass = 'test';
		response.send({redirect:'/'});
	}else response.send({error:'wrong login or password'})
}); 

// 404, 500
app.use( (error, request, response, next) => {
	console.log('error' + error);
    // response.status(error.status || 500);
    response.render('error', {
        message: error.message,
        error: error
    });
});

server.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

// return server;
