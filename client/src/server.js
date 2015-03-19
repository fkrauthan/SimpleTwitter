import {Server} from 'hapi';
import React from 'react';
import Flux from './shared/Flux';
import App from './client/SimpleTwitterApp'
import Path from 'path';

import DocumentTitle from 'react-document-title';


/**
 * Start Hapi server on port 8000.
 */
const server = new Server();

server.connection({
	port: process.env.PORT || 8000
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
	// TODO Async render app

	let appString = React.withContext(
      { flux },
      () => React.renderToString(<App />)
    );


	let title = DocumentTitle.rewind();
	let fluxString = JSON.stringify(flux.serialize());

	const webserver = process.env.NODE_ENV === 'production' ? '' : '//localhost:8080';

	reply.view('layout', {
		appString,
		title,
		fluxString,
		webserver
	});
}

server.start();
