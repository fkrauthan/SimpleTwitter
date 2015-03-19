import React from 'react';
import Flux from './shared/Flux';
import App from './client/SimpleTwitterApp'


/**
 * Enable Accessibility warnings on the client.
 */
if (process.env.NODE_ENV !== 'production') {
	require('react-a11y')();
}


/**
 * Fire-up React.
 */
let flux = new Flux();
flux.deserialize(window.__FLUX__);
React.withContext(
    { flux },
    () => React.render(<App />, window.document.getElementById('app'))
);



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
