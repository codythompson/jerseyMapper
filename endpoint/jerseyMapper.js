'use strict';

/* global require */

var endpoint = require('./endpoint');

var server = new endpoint.Endpoint({port: process.env.PORT || 3000});
server.start();
