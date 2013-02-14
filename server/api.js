
var auth = require(__dirname + '/auth');


exports.init = function(app) {

	// Two test requests to make sure the api works
	app.get('/api/ping', function(req, res) {
		res.json({'pong': true});
	});
	app.post('/api/ping', function(req, res) {
		res.json({'pong': req.body});
	});
	
	// User API
	app.get('/api/users', auth.authenticate, function(req, res) {
		res.json({'users': []});
	});
	
};
