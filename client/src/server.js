import {Server} from 'hapi';
import React from 'react';
import Flux from './shared/Flux';
import App from './client/SimpleTwitterApp'
import Path from 'path';
import ApiUtils from 'api-utils';

import DocumentTitle from 'react-document-title';


/**
 * Read config file for details to the api server
 */
const CONFIG = require(__dirname + '/../config.json');
ApiUtils.setHost(CONFIG.apiserver);


/**
 * Start Hapi server on port 8000.
 */
const server = new Server({
	debug: {
		log: ['hapi'],
		request: ['hapi']
	}
});

server.connection({
	port: process.env.PORT || 2017
});


/**
 * Load template
 */
server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'server')
});

/**
 * Attempt to serve static requests from the public folder.
 */
server.route({
	method:  '*',
	path:    '/{params*}',
	handler: (request, reply) => {
		reply.file('static' + request.path);
	}
});

/**
 * Catch dynamic requests here to fire-up React Router.
 */
server.ext('onPreResponse', (request, reply) => {
	if (typeof request.response.statusCode !== 'undefined') {
		return reply.continue();
	}

	let flux = new Flux();
	flux.getActions('navigation').changePath(request.path);
	flux.getStore('credentials').setConsumerCredentials(CONFIG.oauth);

	var credentials = request.session.get('credentials');
	console.log(request.session.get('credentials'));
	if(credentials) {
		console.log(credentials);
		flux.getStore('credentials').setCredentials(credentials);
	}


	let waitForAsync = false;
	if(request.method === 'post') {
		if(request.payload.actions && request.payload.action) {
			let actionsName = request.payload.actions;
			let actions = flux.getActions(actionsName);
			if(!actions) {
				console.log('Can not find actions ' + actionsName);
				return reply.continue();
			}

			let store = flux.getStore(actionsName);
			if(!store) {
				console.log('Can not find store ' + actionsName);
				return reply.continue();
			}

			let actionName = request.payload.action;
			let action = actions[actionName];
			if(typeof action !== 'function') {
				console.log('Can not find action ' + actionName);
				return reply.continue();
			}

			waitForAsync = true;
			let payload = request.payload[actionsName][actionName];
			async () => {
				if(payload) {
					await action(payload);
				}
				else {
					await action();
				}

				finishUpRequest(request, reply, flux);
			}();
		}
	}

	if(!waitForAsync) {
		finishUpRequest(request, reply, flux);
	}
});

function finishUpRequest(request, reply, flux) {
	if(request.path === '/login' && request.method === 'post') {
		let credentials = flux.getStore('credentials').getCredentials();
		if(credentials) {
			console.log('Set credentials', credentials);
			request.session.set('credentials', credentials);

			//TODO may redirect
		}
	}

	// TODO Async render app

	let appString = React.withContext(
      { flux },
      () => React.renderToString(<App />)
    );


	let title = DocumentTitle.rewind();
	let fluxString = JSON.stringify(flux.serialize());

	const webserver = process.env.NODE_ENV === 'production' ? '' : '//localhost:2080';

	reply.view('layout', {
		appString,
		title,
		fluxString,
		webserver
	});
}


/**
 * Setup plugins
 */
var goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', response: '*' }]
    }]
};
var yarOptions = {
	cookieOptions: {
		password: CONFIG.cookieSalt,
		isSecure: false
	}
};

server.register([{
    register: require('good'),
    options: goodOptions
}, {
	register: require('yar'),
    options: yarOptions
}], function (err) {
    if (err) {
        console.error(err);
    }
    else {
        server.start(function () {
            console.info('Server started at ' + server.info.uri);
        });
    }
});
