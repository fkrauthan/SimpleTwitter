import React from 'react';
import FluxComponent from 'flummox/component';
import Flux from './shared/Flux';
import App from './client/SimpleTwitterApp'


/**
 * Fire-up React.
 */
let flux = new Flux();
flux.deserialize(window.__FLUX__);
React.render(<FluxComponent flux={flux}><App /></FluxComponent>, window.document.getElementById('app'));



/**
 * Detect whether the server-side render has been discarded due to an invalid checksum.
 */
if (process.env.NODE_ENV !== 'production') {
	const app = window.document.getElementById('app');

	if (!app || !app.firstChild ||
	    !app.firstChild.attributes['data-react-checksum']) {
		console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
	}
}
