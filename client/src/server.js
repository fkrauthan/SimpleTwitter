import express from 'express';
import React from 'react';
import FluxComponent from 'flummox/component';
import Flux from './shared/Flux';
import App from './client/SimpleTwitterApp'
import Path from 'path';
import ApiUtils from './api-utils';

import DocumentTitle from 'react-document-title';


/**
 * Read config file for details to the api server
 */
const CONFIG = require(__dirname + '/../config.json');
ApiUtils.setHost(CONFIG.apiserver);


/**
 * Prepare express server
 */
let app = express();


/**
 * Enable session handling
 */
import session from 'express-session';
import bodyParser from 'body-parser';
app.use(session({
	secret: CONFIG.cookieSalt,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));


/**
 * Load template
 */
import ehbs from 'express-hbs';
app.engine('hbs', ehbs.express4({
	partialsDir: __dirname + '/server'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/server/views')


/**
 * Attempt to serve static requests from the public folder.
 */
app.use(express.static('static'));


/**
 * Render application
 */

// Startup flux
app.use(function(req, res, next) {
	let flux = new Flux();
	flux.getActions('navigation').changePath(req.path);
	flux.getStore('credentials').setConsumerCredentials(CONFIG.oauth);

	req.st = {};
	req.st.flux = flux;

	next();
});

// Restore credentials
app.use(function(req, res, next) {
	let flux = req.st.flux;

	var credentials = req.session.credentials;
	if(credentials) {
		flux.getStore('credentials').setCredentials(credentials);
	}

	next();
});

// Process store actions
app.use(function(req, res, next) {
	let flux = req.st.flux;

	let waitForAsync = false;
	if(req.method.toUpperCase() === 'POST') {
		if(req.body.actions && req.body.action) {
			let actionsName = req.body.actions;
			let actions = flux.getActions(actionsName);
			if(!actions) {
				console.log('Can not find actions ' + actionsName);
				return res.status(500).send('Can not find actions ' + actionsName);
			}

			let store = flux.getStore(actionsName);
			if(!store) {
				console.log('Can not find store ' + actionsName);
				return res.status(500).send('Can not find store ' + actionsName);
			}

			let actionName = req.body.action;
			let action = actions[actionName];
			if(typeof action !== 'function') {
				console.log('Can not find action ' + actionName);
				return res.status(500).send('Can not find action ' + actionName);
			}

			waitForAsync = true;
			let payload = req.body[actionsName][actionName];
			async () => {
				if(payload) {
					await action(payload);
				}
				else {
					await action();
				}

				next();
			}();
		}
	}

	if(!waitForAsync) {
		next();
	}
});

// Save credentials
app.use(function(req, res, next) {
	let flux = req.st.flux;

	if(req.path === '/login' && req.method.toUpperCase() === 'POST') {
		let credentials = flux.getStore('credentials').getCredentials();
		if(credentials) {
			req.session.credentials = credentials;
		}
	}

	next();
});

// Execute async data fetching
app.use(function(req, res, next) {
	let flux = req.st.flux;

	//TODO do async data fetching

	next();
});

// Render the app
app.use(function(req, res) {
	let flux = req.st.flux;

	let appString = React.renderToString(<FluxComponent flux={flux}><App /></FluxComponent>);


	let title = DocumentTitle.rewind();
	let fluxString = JSON.stringify(flux.serialize());

	const webserver = process.env.NODE_ENV === 'production' ? '' : '//localhost:2080';

	res.render('layout', {
		appString,
		title,
		fluxString,
		webserver
	});
})


/**
 * Start server
 */
var server = app.listen(process.env.PORT || 2017, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Server started at http://%s:%s', host, port);
});
