SimpleTwitter
=============

A simple twitter clone for testing new technologies like AngularJS, NodeJS and MongoDB.


Installation
============

The following guid shows which software you need to run the project and what you have to do after installing the software.

For the client
--------------

There is nothing to do. Just point your webserver to the client directory and open the location in your browser.


For the server
--------------

### Software you need

* NodeJS
* NPM
* MongoDB

### Installing the dependencies

Just run within the `server` directory the command `npm install`.


Running
=======

To run the server just go to the server directory and run `node app.js` to start the server. If you like to start the sever in development mode just run `NODE_ENV=development node app.js`.

You can also run this command from the project root directory: `npm start`.


Deployment
==========

To deploy the project to appfog just follow the install instructions [here](https://docs.appfog.com/getting-started/af-cli). The project automaticly listen to the enviroment vars set by appfog.


Testing
=======

A test instance of this project is deployed on this URL: [simpletwitter.aws.af.cm](http://simpletwitter.aws.af.cm) (Hosted on a free plan at [appfog](https://www.appfog.com/))
